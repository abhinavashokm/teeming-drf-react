from core.exceptions.helpers import get_object_or_raise
from ..models import Goal


def get_goal_or_raise(workspace, goal_id):
    goal = get_object_or_raise(
        workspace=workspace,
        error_message="Goal not found",
        model=Goal,
        id=goal_id,
    )
    return goal
