from django.urls import path
from apps.notification.consumers import NotificationConsumer
from apps.discussion.consumers import DiscussionConsumer
from apps.workspace.consumers import WorkspaceConsumer


websocket_urlpatterns = [
    path('ws/workspaces/<slug:slug>/', WorkspaceConsumer.as_asgi()),
    path('ws/workspaces/<slug:slug>/notifications/', NotificationConsumer.as_asgi()),
    path('ws/workspaces/<slug:slug>/goals/<uuid:goal_id>/discussion/', DiscussionConsumer.as_asgi()),
]