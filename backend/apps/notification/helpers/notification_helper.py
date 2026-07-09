from core.exceptions.helpers import get_object_or_raise
from ..models import Notification


def get_notification_or_raise(workspace, notification_id, recipient):
    notification = get_object_or_raise(
        workspace=workspace,
        error_message="Notification not found",
        model=Notification,
        id=notification_id,
        recipient=recipient,
    )
    return notification
