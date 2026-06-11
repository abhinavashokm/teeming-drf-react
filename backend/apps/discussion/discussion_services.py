from apps.goal.helpers.goal_helper import get_goal_or_raise
from .models import DiscussionMessage


def list_discussion_messages(workspace, goal_id):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return DiscussionMessage.objects.in_workspace(workspace).filter(goal=goal)
