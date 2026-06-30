from core.exceptions.helpers import get_object_or_raise
from ..models import Plan
from core.constants.plan_codes import PlanCode


def get_plan_or_raise(plan_id=None, code=None, error_message=None, **filters):

    if plan_id is None and code is None:
        raise ValueError("Either 'plan_id' or 'code' must be provided.")
    
    lookup = {**filters}
    if plan_id is not None:
        lookup["id"] = plan_id
    if code is not None:
        lookup["code"] = code

    plan = get_object_or_raise(
        error_message=error_message or "Plan not found",
        model=Plan,
        **lookup,
    )

    return plan


def get_free_plan():
    return get_plan_or_raise(
        code=PlanCode.FREE, error_message="Free plan not found", is_archived=False,
    )
