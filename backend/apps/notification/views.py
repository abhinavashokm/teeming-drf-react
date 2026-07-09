from core.permission_views import MemberBaseView
from .models import Notification
from core.responses.api_response import success_response
from . import notification_services
from rest_framework import status


class NotificationListView(MemberBaseView):

    def get(self, request, **kwargs):
        
        notification = Notification.objects.filter(
            workspace=request.workspace,
            recipient=request.user,
        )

        data = notification.values('id', 'message', 'is_read', 'created_at', 'workspace__name', 'notification_type', 'target_id')
        print(list(data))
        return success_response(
            data=list(data) or []
        )
    
    def patch(self, request, **kwargs):
        """mark all notification as read"""

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
        """mark single notification as read"""
        
        notification_services.mark_notification_as_read(
            workspace=request.workspace,
            recipient=request.user,
            notification_id=kwargs["notification_id"]
        )

        return success_response(
            message="marked as read"
        )
