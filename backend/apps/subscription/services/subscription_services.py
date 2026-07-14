from rest_framework.exceptions import ValidationError

from django.db.models import Q
from django.db import transaction

from ..models import Plan, WorkspaceSubscription, SubscriptionTransaction
from .integrations import stripe_client
from ..helpers.subscription_helper import get_plan_or_raise, get_free_plan
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise


def create_checkout_session(workspace, plan):
    return stripe_client.create_checkout_session(workspace, plan)


def get_current_subscription(workspace):
    subscription = (
        WorkspaceSubscription.objects.select_related("plan")
        .filter(workspace=workspace)
        .filter(
            Q(status=WorkspaceSubscription.StatusChoices.ACTIVE)
            | Q(status=WorkspaceSubscription.StatusChoices.TRIALING)
        )
        .order_by("-started_at")
        .first()
    )

    if subscription:
        return subscription

    free_plan = get_free_plan()
    return WorkspaceSubscription(
        workspace=workspace,
        plan=free_plan,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )


@transaction.atomic
def create_workspace_subscription(
    workspace_id, plan_id, stripe_customer_id, stripe_subscription_id, expires_at
):
    """
    Called after a successful Stripe checkout. Create new subscription
    with stripe details.
    """

    workspace = get_workspace_or_raise(workspace_id=workspace_id)
    current = get_current_subscription(workspace)

    current.status = WorkspaceSubscription.StatusChoices.EXPIRED
    current.save(update_fields=["status"])

    return WorkspaceSubscription.objects.create(
        workspace=workspace,
        plan_id=plan_id,
        stripe_customer_id=stripe_customer_id,
        stripe_subscription_id=stripe_subscription_id,
        expires_at=expires_at,
    )


def create_transaction_log(
    stripe_subscription_id,
    amount,
    currency,
    billing_period_start,
    billing_period_end,
    gateway_invoice_id,
    invoice_url,
    is_renewal,
):
    subscription = (
        WorkspaceSubscription.objects.select_related("plan")
        .filter(stripe_subscription_id=stripe_subscription_id)
        .first()
    )

    if not subscription:
        raise ValidationError(
            f"No subscription found for stripe id: {stripe_subscription_id}"
        )

    SubscriptionTransaction.objects.create(
        workspace=subscription.workspace,
        subscription=subscription,
        plan=subscription.plan,
        type=(
            SubscriptionTransaction.TypeChoices.RENEWAL
            if is_renewal
            else SubscriptionTransaction.TypeChoices.PAYMENT
        ),
        amount=amount / 100,  # stripe sends amount in paise/cents
        currency=currency,
        billing_period_start=billing_period_start,
        billing_period_end=billing_period_end,
        gateway_invoice_id=gateway_invoice_id,
        invoice_url=invoice_url,
    )


def create_free_plan_subscription(workspace):

    free_plan = get_free_plan()
    WorkspaceSubscription.objects.create(workspace=workspace, plan=free_plan)


def downgrade_to_free(workspace):
    """
    Cancel auto-renewal on the workspace's active Stripe subscription.
    Access continues until the current period ends, then the
    workspace downgrades to Free.
    """

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    if not subscription.stripe_subscription_id:
        raise ValueError("No Stripe subscription found")
    
    # Check if subscription is still managed by a schedule
    # (can happen if a previous downgrade schedule wasn't released)
    stripe_sub = stripe_client.retrieve_subscription(subscription.stripe_subscription_id)
    schedule_id = stripe_sub["schedule"]

    if schedule_id:
        stripe_client.release_subscription_schedule(schedule_id)
        subscription.stripe_schedule_id = None
        subscription.scheduled_plan = None
        subscription.save(update_fields=["stripe_schedule_id", "scheduled_plan"])

    stripe_client.cancel_subscription(
        stripe_subscription_id=subscription.stripe_subscription_id
    )

    subscription.cancel_at_period_end = True
    subscription.scheduled_plan = get_free_plan()
    subscription.save(update_fields=["cancel_at_period_end", "scheduled_plan"])

    return subscription


def resume_current_subscription(workspace):
    """
    Undoes any pending plan change — whether a scheduled downgrade or a
    pending cancellation — and keeps the workspace on its current plan.
    """

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    if not subscription.stripe_subscription_id:
        raise ValueError("No Stripe subscription found")

    if subscription.stripe_schedule_id:
        stripe_client.release_subscription_schedule(subscription.stripe_schedule_id)
    elif subscription.cancel_at_period_end:
        stripe_client.resume_subscription(
            stripe_subscription_id=subscription.stripe_subscription_id
        )

    subscription.cancel_at_period_end = False
    subscription.scheduled_plan = None
    subscription.stripe_schedule_id = None
    subscription.save(
        update_fields=[
            "cancel_at_period_end",
            "scheduled_plan",
            "stripe_schedule_id",
        ]
    )

    return subscription


def admin_list_transactions(year=None, month=None, search=None):
    qs = SubscriptionTransaction.objects.select_related(
        "workspace", "workspace__owner", "plan"
    ).order_by("-created_at")

    if year and year != "all":
        qs = qs.filter(created_at__year=year)

    if month and month != "all":
        qs = qs.filter(created_at__month=month)

    if search:
        qs = qs.filter(workspace__name__icontains=search)

    return qs


# In sync_workspace_subscription (called from customer.subscription.updated):
@transaction.atomic
def sync_workspace_subscription(
    stripe_subscription_id,
    stripe_status,
    cancel_at_period_end,
    stripe_price_id,
    expires_at,
):
    subscription = WorkspaceSubscription.objects.get(
        stripe_subscription_id=stripe_subscription_id,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    plan = Plan.objects.filter(
        stripe_price_id=stripe_price_id, is_archived=False
    ).first()

    # Plan changed (schedule phase transition or direct price change) —
    # expire current row and create a new one for the new plan.
    if plan and subscription.plan_id != plan.id:
        subscription.status = WorkspaceSubscription.StatusChoices.EXPIRED
        subscription.save(update_fields=["status"])

        subscription = WorkspaceSubscription.objects.create(
            workspace=subscription.workspace,
            plan=plan,
            stripe_customer_id=subscription.stripe_customer_id,
            stripe_subscription_id=stripe_subscription_id,
            expires_at=expires_at,
            cancel_at_period_end=cancel_at_period_end,
        )

    else:
        # No plan change — just sync billing state on the existing row
        # (period renewal, cancel toggle, resume, payment status change).
        subscription.cancel_at_period_end = cancel_at_period_end
        subscription.expires_at = expires_at
        subscription.save(update_fields=[
            "cancel_at_period_end",
            "expires_at",
        ])

    return subscription


def preview_upgrade(workspace, plan_id):
    """
    Returns the prorated amount that would be charged right now if the
    workspace's active subscription were upgraded to `plan`. Read-only —
    does not modify the subscription or charge anything.
    """

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    plan = get_plan_or_raise(plan_id=plan_id)

    if not subscription.stripe_subscription_id:
        raise ValueError("No active Stripe subscription found")

    if not plan.stripe_price_id:
        raise ValueError("Selected plan is not configured for billing")

    preview = stripe_client.get_upcoming_invoice_preview(
        stripe_subscription_id=subscription.stripe_subscription_id,
        new_price_id=plan.stripe_price_id,
    )

    return preview


def upgrade_subscription_plan(workspace, plan):
    """
    Upgrades the workspace's active subscription to `plan` immediately,
    charging the prorated difference on the customer's saved card via
    Stripe. Local subscription state is updated optimistically here, and
    will also be reconciled by the customer.subscription.updated webhook.
    """

    subscription = get_current_subscription(workspace=workspace)

    if not subscription.stripe_subscription_id:
        raise ValueError("No active Stripe subscription found")

    if not plan.stripe_price_id:
        raise ValueError("Selected plan is not configured for billing")

    if subscription.plan_id == plan.id:
        raise ValueError("Workspace is already on this plan")

    stripe_client.change_subscription_price(
        stripe_subscription_id=subscription.stripe_subscription_id,
        new_price_id=plan.stripe_price_id,
    )

    with transaction.atomic():
        subscription.status = WorkspaceSubscription.StatusChoices.EXPIRED
        subscription.save(update_fields=["status"])

        return WorkspaceSubscription.objects.create(
            workspace=workspace,
            plan=plan,
            stripe_customer_id=subscription.stripe_customer_id,
            stripe_subscription_id=subscription.stripe_subscription_id,
            expires_at=subscription.expires_at,
        )


def downgrade_subscription_plan(workspace, plan):
    """
    Schedules the workspace's subscription to switch to a lower-tier
    `plan` at the end of the current billing period. Access to the
    current plan continues until then — no proration, no immediate
    feature changes.
    """

    subscription = get_current_subscription(workspace=workspace)
    if not subscription.stripe_subscription_id:
        raise ValueError("No active Stripe subscription found")

    if not plan.stripe_price_id:
        raise ValueError("Selected plan is not configured for billing")

    if subscription.plan_id == plan.id:
        raise ValueError("Workspace is already on this plan")

    schedule = stripe_client.schedule_plan_change(
        stripe_subscription_id=subscription.stripe_subscription_id,
        new_price_id=plan.stripe_price_id,
    )

    subscription.scheduled_plan = plan
    subscription.stripe_schedule_id = schedule.id
    subscription.save(update_fields=["scheduled_plan", "stripe_schedule_id"])

    return subscription


def cancel_scheduled_downgrade(workspace):
    """
    Cancels a pending scheduled downgrade (or scheduled cancel-to-free)
    by releasing the Stripe Subscription Schedule, and clears the local
    scheduled state. The subscription continues on its current plan.
    """

    subscription = get_current_subscription(workspace=workspace)

    if subscription.stripe_schedule_id:
        stripe_client.release_subscription_schedule(subscription.stripe_schedule_id)

    subscription.scheduled_plan = None
    subscription.cancel_at_period_end = False
    subscription.stripe_schedule_id = None
    subscription.save(
        update_fields=[
            "scheduled_plan",
            "cancel_at_period_end",
            "stripe_schedule_id",
        ]
    )

    return subscription



