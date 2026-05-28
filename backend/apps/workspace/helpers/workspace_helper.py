from core.exceptions.base import NotFoundException
from ..models import Workspace


def get_workspace_or_raise(workspace_id):
    try:
        return Workspace.objects.get(id=workspace_id)
    except Workspace.DoesNotExist:
        raise NotFoundException("Workspace not found")

