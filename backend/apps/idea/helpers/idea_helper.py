from core.exceptions.helpers import get_object_or_raise
from ..models import Idea


def get_idea_or_raise(workspace, idea_id):
    idea = get_object_or_raise(
        workspace=workspace,
        error_message="Idea not found",
        model=Idea,
        id=idea_id,
    )
    return idea
