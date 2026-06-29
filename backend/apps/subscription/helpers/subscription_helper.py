from core.exceptions.helpers import get_object_or_raise
from ..models import Plan


def get_plan_or_raise(plan_id, error_message=None, **filters):
    plan = get_object_or_raise(
        error_message = error_message or "Plan not found",
        model=Plan,
        id=plan_id,
        **filters
    )
    return plan
