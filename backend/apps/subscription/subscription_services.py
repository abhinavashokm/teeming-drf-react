import stripe
import uuid
from rest_framework.exceptions import ValidationError
from decimal import Decimal

from django.db.models.functions import Coalesce
from django.db.models import Q, Max, Count, Sum, DecimalField, Value
from django.db import transaction
from django.utils import timezone

from .models import Plan, WorkspaceSubscription, SubscriptionTransaction
from core.exceptions.base import NotFoundException
from . import strip_services
from .models import WorkspaceSubscription
from .helpers.subscription_helper import get_plan_or_raise
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from apps.workspace.models import Workspace, WorkspaceMember


def create_plan(data):
    stripe_data = strip_services.create_plan_in_stripe(
        name=data["name"],
        description=data["description"],
        monthly_price=data["monthly_price"],
    )
    plan = Plan.objects.create(
        **data,
        stripe_product_id=stripe_data["product_id"],
        stripe_price_id=stripe_data["price_id"],
    )

    return plan


def create_new_plan_version(plan_id: uuid.UUID, data: dict) -> Plan:

    plan = get_plan_or_raise(
        plan_id=plan_id,
        error_message="Plan not found or already archived.",
        is_archived=False,
    )

    # get next version number for this plan code family
    latest_version = (
        Plan.objects.filter(code=plan.code).aggregate(max_version=Max("version"))[
            "max_version"
        ]
        or 0
    )

    with transaction.atomic():

        # archive the old plan and point it to the new one
        plan.is_archived = True
        plan.archived_at = timezone.now()
        plan.save(update_fields=["is_archived", "archived_at"])

        # create new plan — carry over locked fields, apply new data
        new_plan = Plan.objects.create(
            # locked fields copied from old plan
            code=plan.code,
            tier=plan.tier,
            currency=plan.currency,
            stripe_product_id=plan.stripe_product_id,
            # versioning
            version=latest_version + 1,
            is_archived=False,
            # structural fields from request (new data overrides, fallback to old)
            name=data.get("name", plan.name),
            description=data.get("description", plan.description),
            monthly_price=data.get("monthly_price", plan.monthly_price),
            max_members=data.get("max_members", plan.max_members),
            max_goals=data.get("max_goals", plan.max_goals),
            can_use_ai_idea_suggestions=data.get(
                "can_use_ai_idea_suggestions", plan.can_use_ai_idea_suggestions
            ),
            can_use_ai_assistant=data.get(
                "can_use_ai_assistant", plan.can_use_ai_assistant
            ),
            can_export_workspace_data=data.get(
                "can_export_workspace_data", plan.can_export_workspace_data
            ),
        )

        plan.replaced_by = new_plan
        plan.save(update_fields=["replaced_by"])

    return new_plan


def list_plans():
    return Plan.objects.all()


def admin_list_plans():
    return Plan.objects.annotate(
        subscriber_count=Count(
            "subscriptions",
            filter=Q(subscriptions__status=WorkspaceSubscription.StatusChoices.ACTIVE),
        )
    ).order_by("tier", "version")


def list_active_plans():
    return Plan.objects.filter(is_archived=False)


def get_plan(plan_id):
    return get_plan_or_raise(plan_id=plan_id)


def delete_plan(plan_id):
    plan = get_plan_or_raise(plan_id=plan_id)
    plan.soft_delete()


def update_plan(plan_id, data):
    plan = get_plan_or_raise(plan_id=plan_id)

    name = data.get("name", None)
    description = data.get("description", None)

    if name:
        plan.name = name

    if description:
        plan.description = description

    plan.save(update_fields=["name", "description"])


def archive_plan(plan_id):
    plan = get_plan_or_raise(plan_id=plan_id)

    if plan.code.upper() == "FREE":
        raise ValidationError(
            "The Free plan cannot be archived. It must always remain active."
        )

    active_plans = Plan.objects.filter(is_archived=False)
    active_count = active_plans.count()

    if active_count <= 2:
        raise ValidationError(
            "Cannot archive this plan. There must always be at least two active plans including the Free plan."
        )

    plan.is_archived = True
    plan.archived_at = timezone.now()
    plan.save(update_fields=["is_archived", "archived_at"])


def restore_plan(plan_id):
    plan = get_plan_or_raise(plan_id=plan_id)
    plan.is_archived = False
    plan.archived_at = None
    plan.save()


def create_checkout_session(workspace, plan):
    return strip_services.create_checkout_session(workspace, plan)


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
    free_plan = Plan.objects.filter(code="FREE", is_archived=False).first()
    if free_plan:
        return WorkspaceSubscription(
            workspace=workspace,
            plan=free_plan,
            status=WorkspaceSubscription.StatusChoices.ACTIVE,
        )

    return None


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

    try:
        free_plan = Plan.objects.get(code="FREE", is_archived=False)
    except Plan.DoesNotExist:
        raise NotFoundException("Free plan not found")

    WorkspaceSubscription.objects.create(workspace=workspace, plan=free_plan)


def downgrade_to_free(workspace):

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    if not subscription.stripe_subscription_id:
        raise ValueError("No Stripe subscription found")

    stripe.Subscription.modify(
        subscription.stripe_subscription_id,
        cancel_at_period_end=True,
    )

    subscription.cancel_at_period_end = True
    subscription.scheduled_plan = Plan.objects.get(code="FREE")
    subscription.save(update_fields=["cancel_at_period_end", "scheduled_plan"])

    return subscription


def resume_current_subscription(workspace):

    subscription = WorkspaceSubscription.objects.get(
        workspace=workspace,
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    if not subscription.stripe_subscription_id:
        raise ValueError("No Stripe subscription found")

    subscription.cancel_at_period_end = False
    subscription.scheduled_plan = None
    subscription.save(update_fields=["cancel_at_period_end", "scheduled_plan"])

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


def get_billing_overview():
    return {
        "overview": _get_overview(),
        "plan_distribution": _get_plan_distribution(),
        "top_paying_workspaces": _get_top_paying_workspaces(),
    }


def _get_overview():
    active_subscriptions = WorkspaceSubscription.objects.filter(
        status=WorkspaceSubscription.StatusChoices.ACTIVE
    )

    total_revenue = SubscriptionTransaction.objects.aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(Decimal("0.00")),
            output_field=DecimalField(max_digits=10, decimal_places=2),
        )
    )["total"]

    return {
        "total_revenue": total_revenue,
        "active_subscriptions": active_subscriptions.count(),
        "total_workspaces": Workspace.objects.count(),
        "total_members": WorkspaceMember.objects.count(),
    }


def _get_plan_distribution():
    total = WorkspaceSubscription.objects.filter(
        status=WorkspaceSubscription.StatusChoices.ACTIVE
    ).count()

    plans = (
        Plan.objects.filter(is_archived=False)
        .annotate(
            count=Count(
                "subscriptions",
                filter=Q(
                    subscriptions__status=WorkspaceSubscription.StatusChoices.ACTIVE
                ),
            )
        )
        .order_by("tier")
    )

    return [
        {
            "code": plan.code,
            "name": plan.name,
            "count": plan.count,
            "percentage": round((plan.count / total) * 100, 1) if total else 0,
        }
        for plan in plans
    ]


def _get_top_paying_workspaces():
    subscriptions = (
        WorkspaceSubscription.objects.filter(
            status=WorkspaceSubscription.StatusChoices.ACTIVE
        )
        .exclude(plan__monthly_price=0)
        .select_related("workspace", "plan")
        .order_by("-plan__monthly_price")[:5]
    )

    return [
        {
            "id": subscription.workspace.id,
            "name": subscription.workspace.name,
            "plan": subscription.plan.name,
            "amount": subscription.plan.monthly_price,
        }
        for subscription in subscriptions
    ]
