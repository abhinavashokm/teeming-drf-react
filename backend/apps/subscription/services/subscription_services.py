from rest_framework.exceptions import ValidationError

from django.db.models import Q
from django.db import transaction
from django.utils import timezone

from ..models import Plan, WorkspaceSubscription, SubscriptionTransaction
from . import stripe_services
from ..helpers.subscription_helper import get_plan_or_raise, get_free_plan
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise


def create_checkout_session(workspace, plan):
    return stripe_services.create_checkout_session(workspace, plan)


# def upgrade_subscription(workspace, new_plan):
#     subscription = WorkspaceSubscription.objects.get(
#         workspace=workspace,
#         status=WorkspaceSubscription.StatusChoices.ACTIVE,
#     )

#     if not subscription.stripe_subscription_id:
#         raise ValueError("No active Stripe subscription found")

#     stripe_subscription = stripe.Subscription.retrieve(
#         subscription.stripe_subscription_id
#     )
#     item_id = stripe_subscription["items"]["data"][0]["id"]

#     stripe.Subscription.modify(
#         subscription.stripe_subscription_id,
#         items=[{"id": item_id, "price": new_plan.stripe_price_id}],
#         proration_behavior="always_invoice",  # charge prorated diff now
#     )

#     # Local state will be confirmed by the webhook (customer.subscription.updated),
#     # but update optimistically here so the UI reflects it immediately.
#     subscription.plan = new_plan
#     subscription.cancel_at_period_end = False
#     subscription.scheduled_plan = None
#     subscription.save(update_fields=["plan", "cancel_at_period_end", "scheduled_plan"])

#     return subscription


def get_current_plan(workspace):
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

    # fallback to free plan if no active subscription found
    free_plan = get_free_plan()
    return WorkspaceSubscription(
        workspace=workspace,
        plan=free_plan,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )


def create_workspace_subscription(
    workspace_id,
    plan_id,
    stripe_customer_id,
    stripe_subscription_id,
    expires_at,
):
    """upgrade workspace subscription plan"""

    workspace = get_workspace_or_raise(workspace_id=workspace_id)

    active_subscription = get_current_plan(workspace=workspace)

    with transaction.atomic():

        if active_subscription:
            active_subscription.status = WorkspaceSubscription.StatusChoices.CANCELLED
            active_subscription.cancelled_at = timezone.now()
            active_subscription.save(update_fields=["status", "expires_at"])

        WorkspaceSubscription.objects.create(
            workspace_id=workspace_id,
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

    stripe_services.cancel_subscription(
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
        stripe_services.release_subscription_schedule(
            subscription.stripe_schedule_id
        )
    elif subscription.cancel_at_period_end:
        stripe_services.resume_subscription(
            stripe_subscription_id=subscription.stripe_subscription_id
        )

    subscription.cancel_at_period_end = False
    subscription.scheduled_plan = None
    subscription.stripe_schedule_id = None
    subscription.save(update_fields=[
        "cancel_at_period_end",
        "scheduled_plan",
        "stripe_schedule_id",
    ])

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
        stripe_subscription_id=stripe_subscription_id
    )

    plan = Plan.objects.filter(
        stripe_price_id=stripe_price_id, is_archived=False
    ).first()

    if plan and subscription.plan_id != plan.id:
        # The schedule's phase transition (or any direct price change)
        # has taken effect on Stripe's side — apply it locally and
        # clear the scheduled state, since it's no longer "pending".
        subscription.plan = plan
        subscription.scheduled_plan = None
        subscription.stripe_schedule_id = None

    subscription.status = (
        WorkspaceSubscription.StatusChoices.ACTIVE
        if stripe_status == "active"
        else WorkspaceSubscription.StatusChoices.EXPIRED
    )
    subscription.cancel_at_period_end = cancel_at_period_end
    subscription.expires_at = expires_at

    subscription.save(
        update_fields=[
            "plan",
            "scheduled_plan",
            "stripe_schedule_id",
            "status",
            "cancel_at_period_end",
            "expires_at",
        ]
    )

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

    preview = stripe_services.get_upcoming_invoice_preview(
        stripe_subscription_id=subscription.stripe_subscription_id,
        new_price_id=plan.stripe_price_id,
    )

    return preview


def upgrade_plan(workspace, plan):
    """
    Upgrades the workspace's active subscription to `plan` immediately,
    charging the prorated difference on the customer's saved card via
    Stripe. Local subscription state is updated optimistically here, and
    will also be reconciled by the customer.subscription.updated webhook.
    """

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    if not subscription.stripe_subscription_id:
        raise ValueError("No active Stripe subscription found")

    if not plan.stripe_price_id:
        raise ValueError("Selected plan is not configured for billing")

    if subscription.plan_id == plan.id:
        raise ValueError("Workspace is already on this plan")

    stripe_services.change_subscription_price(
        stripe_subscription_id=subscription.stripe_subscription_id,
        new_price_id=plan.stripe_price_id,
    )

    subscription.plan = plan
    subscription.cancel_at_period_end = False
    subscription.scheduled_plan = None
    subscription.save(update_fields=["plan", "cancel_at_period_end", "scheduled_plan"])

    return subscription


def downgrade_plan(workspace, plan):
    """
    Schedules the workspace's subscription to switch to a lower-tier
    `plan` at the end of the current billing period. Access to the
    current plan continues until then — no proration, no immediate
    feature changes.
    """
 
    subscription = get_current_plan(workspace=workspace)
    if not subscription.stripe_subscription_id:
        raise ValueError("No active Stripe subscription found")
 
    if not plan.stripe_price_id:
        raise ValueError("Selected plan is not configured for billing")
 
    if subscription.plan_id == plan.id:
        raise ValueError("Workspace is already on this plan")
 
    schedule = stripe_services.schedule_plan_change(
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
 
    subscription = get_current_plan(workspace=workspace)
 
    if subscription.stripe_schedule_id:
        stripe_services.release_subscription_schedule(
            subscription.stripe_schedule_id
        )
 
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