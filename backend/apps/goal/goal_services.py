from .models import Goal, StarredGoal
from . import exceptions
from .helpers.goalHelper import get_goal_or_raise


def create_goal(data):
    """create a new goal"""

    return Goal.objects.create(**data)


def list_workspace_goals(workspace):
    """return all goals in the current workspace"""

    return Goal.objects.in_workspace(workspace)


def update_goal(workspace, goal_id, data):
    "update goal with given fields"

    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id
    )

    for field, value in data.items():
        setattr(goal, field, value)

    goal.save()
    return goal


def delete_goal(workspace, goal_id):
    "delete goal using id"

    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id
    )

    goal.soft_delete()


def star_goal(user, workspace, goal_id):
    """star a goal by user"""

    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id,
    )

    StarredGoal.objects.get_or_create(user=user, workspace=workspace, goal=goal)


def unstar_goal(user, workspace, goal_id):
    """unstar a goal by user"""

    goal = get_goal_or_raise(
        workspace=workspace, 
        goal_id=goal_id
    )

    StarredGoal.objects.in_workspace(workspace).filter(goal=goal, user=user).delete()
