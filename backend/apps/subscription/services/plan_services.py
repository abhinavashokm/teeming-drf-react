import uuid
from rest_framework.exceptions import ValidationError

from django.db.models import Q, Max, Count
from django.db import transaction
from django.utils import timezone

from ..models import Plan, WorkspaceSubscription
from apps.subscription.constants import PlanCode
from .integrations import stripe_client
from ..helpers.subscription_helper import get_plan_or_raise, get_free_plan


def create_plan(data):
    stripe_data = stripe_client.create_plan_in_stripe(
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


def update_plan(plan_id, data):
    plan = get_plan_or_raise(plan_id=plan_id)

    name = data.get("name", None)
    description = data.get("description", None)

    if name:
        plan.name = name

    if description:
        plan.description = description

    plan.save(update_fields=["name", "description"])

    if plan.stripe_product_id:
        stripe_client.modify_product(
            product_id=plan.stripe_product_id,
            name=plan.name,
            description=plan.description or "",
        )

    return plan


def update_free_plan(data):
    """
    free plan details and features can be updated directly without creating a new version
    """

    plan = get_free_plan()

    for field, value in data.items():
        setattr(plan, field, value)

    plan.save(update_fields=list(data.keys()))

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

    new_monthly_price = data.get("monthly_price", plan.monthly_price)
    price_changed = new_monthly_price != plan.monthly_price
    new_stripe_price_id = plan.stripe_price_id

    if price_changed:
        new_stripe_price_id = stripe_client.create_price_for_product(
            product_id=plan.stripe_product_id,
            monthly_price=new_monthly_price,
            currency=plan.currency,
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
            stripe_price_id=new_stripe_price_id,
            # versioning
            version=latest_version + 1,
            is_archived=False,
            # structural fields from request (new data overrides, fallback to old)
            name=data.get("name", plan.name),
            description=data.get("description", plan.description),
            monthly_price=data.get("monthly_price", plan.monthly_price),
            max_members=data.get("max_members", plan.max_members),
            max_goals=data.get("max_goals", plan.max_goals),
            can_use_ai_enhancements=data.get(
                "can_use_ai_enhancements", plan.can_use_ai_enhancements
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


def archive_plan(plan_id):
    plan = get_plan_or_raise(plan_id=plan_id)

    if plan.code.upper() == PlanCode.FREE:
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
