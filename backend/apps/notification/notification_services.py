from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification


def notify_workspace_members(workspace, message, exclude_user=None):
    """
    Creates a Notification record for each workspace member
    and pushes it via WebSocket.
    """

    channel_layer = get_channel_layer()
    members = workspace.members.all()

    # if exclude_user:
    #     members = members.exclude(user__id=exclude_user.id)

    for member in members:

        notification = Notification.objects.create(
            recipient=member.user,
            workspace=workspace,
            message=message,
        )

        # Push via WebSocket
        async_to_sync(channel_layer.group_send)(
            f"notifications_user_{member.user.id}",
            {
                'type': "send_notification",
                "data": {
                    "id": notification.id,
                    "message": notification.message,
                    "workspace": workspace.name,
                    "is_read": False,
                    "created_at": str(notification.created_at)
                }
            }
        )


def mark_all_read(workspace, recipient):
    
    Notification.objects.filter(
        workspace=workspace,
        recipient=recipient,
        is_read=False
    ).update(is_read=True)


def clear_all(workspace, recipient):

    Notification.objects.filter(
        workspace=workspace,
        recipient=recipient
    ).delete()



