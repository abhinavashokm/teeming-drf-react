from .models import Goal, StarredGoal
from .helpers.goal_helper import get_goal_or_raise
from django.db.models import Exists, OuterRef, Count, Q


def create_goal(data):
    """create a new goal"""

    return Goal.objects.create(**data)


def get_goal(workspace, goal_id):
    """return a single goal by id"""
    
    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id
    )

    return goal


def list_workspace_goals(workspace, user):
    """return all goals in the current workspace with is starred field annotated"""

    starred_goals = StarredGoal.objects.in_workspace(workspace).filter(
        user=user,
        goal = OuterRef("pk")
    )

    return (
        Goal.objects
        .in_workspace(workspace)
        .annotate(
            is_starred=Exists(starred_goals),
            ideas_count=Count(
                "ideas",
                filter=Q(ideas__is_deleted=False),
            ),
        )
        .order_by("-is_starred", "-created_at")
    )

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


def get_workspace_goal_count(workspace):

    return Goal.objects.in_workspace(workspace).count()