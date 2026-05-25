from .models import Goal
from . import exceptions


def create_goal(data):
    """create a new goal"""

    return Goal.objects.create(**data)


def list_workspace_goals(workspace):
    """return all goals in the current workspace"""

    return Goal.objects.in_workspace(workspace)


def update_goal(goal_id, data):
    "update goal with given fields"

    goal = Goal.objects.filter(id=goal_id).first()

    if not goal:
        exceptions.GoalNotFound()

    for field, value in data.items():
        setattr(goal, field, value)
    
    goal.save()
    return goal