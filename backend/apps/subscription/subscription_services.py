from django.db.models import Q
from django.db import transaction

from core.exceptions.base import NotFoundException
from .models import Plan
from . import strip_services
from .models import WorkspaceSubscription
from .helpers.subscription_helper import get_plan_or_raise
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from django.utils import timezone


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


def list_plans():
    return Plan.objects.all()


def delete_plan(plan_id):
    plan = get_plan_or_raise(plan_id=plan_id)
    plan.soft_delete()


def create_checkout_session(workspace, plan):
    return strip_services.create_checkout_session(workspace, plan)


def get_current_plan(workspace):
    return (
        WorkspaceSubscription.objects.select_related("plan")
        .filter(workspace=workspace)
        .filter(
            Q(status=WorkspaceSubscription.StatusChoices.ACTIVE)
            | Q(status=WorkspaceSubscription.StatusChoices.TRIALING)
        )
        .order_by("-started_at")
        .first()
    )


def create_workspace_subscription(
    workspace_id, plan_id, stripe_customer_id, stripe_subscription_id, expires_at,
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


def create_free_plan_subscription(workspace):

    try:
        free_plan = Plan.objects.get(code="FREE")
    except Plan.DoesNotExist:
        raise NotFoundException("Free plan not found")

    WorkspaceSubscription.objects.create(workspace=workspace, plan=free_plan)
