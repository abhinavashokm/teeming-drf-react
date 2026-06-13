from django.db.models import Q

from .models import Plan
from . import strip_services
from .models import WorkspaceSubscription


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


def create_checkout_session(workspace, plan):
    return strip_services.create_checkout_session(workspace, plan)


def create_workspace_subscription(
    workspace_id, plan_id, stripe_customer_id, stripe_subscription_id
):
    WorkspaceSubscription.objects.update_or_create(
        workspace_id=workspace_id,
        defaults={
            "plan_id": plan_id,
            "stripe_customer_id": stripe_customer_id,
            "stripe_subscription_id": stripe_subscription_id,
            "status": "active",
        },
    )


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
