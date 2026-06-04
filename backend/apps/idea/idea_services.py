from .models import Idea
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from apps.goal.helpers.goal_helper import get_goal_or_raise
from .helpers.idea_helper import get_idea_or_raise


def create_idea(created_by, workspace, goal_id, data):

    # ensure workspace exists
    workspace = get_workspace_or_raise(workspace_id=workspace.id)

    # ensure goal exists
    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    created_idea = Idea.objects.create(
        created_by=created_by, workspace=workspace, goal=goal, **data
    )

    return created_idea


def list_goal_ideas(workspace, goal_id):
    """list all ideas under a single goal"""

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return Idea.objects.in_workspace(workspace).filter(goal=goal)


def get_idea(workspace, idea_id):
    return get_idea_or_raise(workspace=workspace, idea_id=idea_id)


def delete_idea(workspace, idea_id):
    idea = get_idea_or_raise(workspace=workspace, idea_id=idea_id)
    idea.soft_delete()
    return True
