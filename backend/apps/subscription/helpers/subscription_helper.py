from core.exceptions.helpers import get_object_or_raise
from ..models import Plan


def get_plan_or_raise(workspace, plan_id):
    plan = get_object_or_raise(
        workspace=workspace,
        error_message="Plan not found",
        model=Plan,
        id=plan_id,
    )
    return plan
