from core.exceptions.base import NotFoundException
from ..models import Workspace
from core import redis_store


def get_workspace_or_raise(workspace_id):
    try:
        return Workspace.objects.get(id=workspace_id)
    except Workspace.DoesNotExist:
        raise NotFoundException("Workspace not found")


def make_live_presence_key(workspace_slug):
    return redis_store.make_key(prefix="presence", identifier=workspace_slug)
