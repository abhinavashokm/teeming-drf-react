from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from .helpers.notification_helper import get_notification_or_raise


def notify_users(workspace, users, message, notification_type=Notification.NotificationType.BOARD_RELATED ,target_id=None, exclude_user=None):
    """
    Create notifications and push them via WebSocket
    for a specific list/queryset of User objects.
    """

    channel_layer = get_channel_layer()

    if exclude_user:
        users = [user for user in users if user.id != exclude_user.id]

    for user in users:

        notification = Notification.objects.create(
            recipient=user,
            workspace=workspace,
            message=message,
            target_id=target_id,
            notification_type=notification_type,
        )

        async_to_sync(channel_layer.group_send)(
            f"notifications_user_{user.id}",
            {
                "type": "notification_update",
                "id": str(notification.id),
                "message": notification.message,
                "workspace": workspace.name,
                "is_read": False,
                "created_at": notification.created_at.isoformat(),
                "target_id": str(notification.target_id),
                "notification_type": notification.notification_type,
            },
        )


def notify_workspace_members(
    workspace,
    message,
    notification_type=Notification.NotificationType.BOARD_RELATED,
    target_id=None,
    exclude_user=None,
):
    """
    Creates a Notification record for each workspace member
    and pushes it via WebSocket.
    """

    members = workspace.members.select_related("user")

    if exclude_user:
        members = members.exclude(user__id=exclude_user.id)

    notify_users(
        workspace=workspace,
        users=[member.user for member in members],
        message=message,
        target_id=target_id,
        notification_type=notification_type,
    )


def mark_notification_as_read(workspace, recipient, notification_id):
    
    notification = get_notification_or_raise(
        workspace=workspace,
        recipient=recipient,
        notification_id=notification_id,
    )

    notification.is_read = True
    notification.save()

    return True


def mark_all_read(workspace, recipient):

    Notification.objects.filter(
        workspace=workspace, recipient=recipient, is_read=False
    ).update(is_read=True)


def clear_all(workspace, recipient):

    Notification.objects.filter(workspace=workspace, recipient=recipient).delete()
