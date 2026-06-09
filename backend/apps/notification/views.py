from core.permission_views import MemberBaseView
from .models import Notification
from core.responses.api_response import success_response
from . import notification_services


class NotificationListView(MemberBaseView):

    def get(self, request, **kwargs):
        
        notification = Notification.objects.filter(
            workspace=request.workspace,
            recipient=request.user,
        )

        data = notification.values('id', 'message', 'is_read', 'created_at', 'workspace__name')

        return success_response(
            data=list(data)
        )
    
    def patch(self, request, **kwargs):

        notification_services.mark_all_read(
            workspace=request.workspace,
            recipient=request.user,
        )

        return success_response(
            message="marked all as read"
        )
    
    def delete(self, request, **kwargs):
        
        notification_services.clear_all(
            workspace=request.workspace,
            recipient=request.user,
        )

        return success_response(
            message="All notification cleared"
        )
    

class NotificationDetailView(MemberBaseView):

    def patch(self, request, **kwargs):
        
        notification = Notification.objects.get(recipient=request.user, id=kwargs["notification_id"])
        notification.is_read = True
        notification.save()
        return success_response(
            data={
                "status": "marked as read"
            }
        )
