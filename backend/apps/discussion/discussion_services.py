from apps.goal.helpers.goal_helper import get_goal_or_raise
from .models import DiscussionMessage


def list_discussion_messages(workspace, goal_id, page=1, limit=20):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    queryset = DiscussionMessage.objects.in_workspace(workspace).filter(goal=goal).order_by('-created_at')

    total = queryset.count()
    offset = (int(page) - 1) * limit
    messages = list(queryset[offset : offset + limit])
    messages.reverse()   # oldest-first within the page

    return {
        'messages': messages,
        'has_more': (offset + limit) < total,
        'total': total,
    }