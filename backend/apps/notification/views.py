from core.permission_views import MemberBaseView
from rest_framework.views import APIView
from .models import Notification
from core.responses.api_response import success_response


class NotificationListView(APIView):

    def get(self, request, **kwargs):
        
        notification = Notification.objects.filter(
            workspace=request.workspace,
            recipient=request.user,
        )

        data = notification.values('id', 'message', 'is_read', 'created_at', 'workspace__name')

        return success_response(
            data=list(data)
        )
    

class NotificationDetailView(APIView):

    def patch(self, request, **kwargs):
        
        notification = Notification.objects.get(recipient=request.user, id=kwargs["notification_id"])
        notification.is_read = True
        notification.save()
        return success_response(
            data={
                "status": "marked as read"
            }
        )
