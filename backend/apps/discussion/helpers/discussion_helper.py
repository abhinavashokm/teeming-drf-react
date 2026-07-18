from core import redis_store

def make_discussion_viewer_key(goal_id):
    return redis_store.make_key(prefix="discussion_viewers", identifier=goal_id)