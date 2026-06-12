from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification


def notify_users(workspace, users, message, exclude_user=None):
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
        )

        async_to_sync(channel_layer.group_send)(
            f"notifications_user_{user.id}",
            {
                "type": "send_notification",
                "id": notification.id,
                "message": notification.message,
                "workspace": workspace.name,
                "is_read": False,
                "created_at": notification.created_at.isoformat(),
            },
        )


def notify_workspace_members(workspace, message, exclude_user=None):
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
    )


def mark_all_read(workspace, recipient):

    Notification.objects.filter(
        workspace=workspace, recipient=recipient, is_read=False
    ).update(is_read=True)


def clear_all(workspace, recipient):

    Notification.objects.filter(workspace=workspace, recipient=recipient).delete()
