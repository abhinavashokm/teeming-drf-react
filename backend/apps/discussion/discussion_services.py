from apps.goal.helpers.goal_helper import get_goal_or_raise
from .models import DiscussionMessage
from core import redis_store
from .helpers.discussion_helper import make_discussion_viewer_key


def list_discussion_messages(workspace, goal_id, page=1, limit=20):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    queryset = (
        DiscussionMessage.objects.in_workspace(workspace)
        .filter(goal=goal)
        .order_by("-created_at")
    )

    total = queryset.count()
    offset = (int(page) - 1) * limit
    messages = list(queryset[offset : offset + limit])
    messages.reverse()  # oldest-first within the page

    return {
        "messages": messages,
        "has_more": (offset + limit) < total,
        "total": total,
    }


def add_discussion_viewer(goal_id, user_id):
    redis_store.add_to_set(
        key=make_discussion_viewer_key(goal_id=goal_id),
        value=str(user_id),
    )


def remove_discussion_viewer(goal_id, user_id):
    redis_store.remove_from_set(
        key=make_discussion_viewer_key(goal_id=goal_id),
        value=str(user_id),
    )


def get_discussion_viewers(goal_id):
    return {
        str(uid)
        for uid in redis_store.get_set_members(
            make_discussion_viewer_key(goal_id=goal_id)
        )
    }