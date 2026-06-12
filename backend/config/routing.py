from django.urls import path
from apps.notification.consumers import NotificationConsumer
from apps.discussion.consumers import DiscussionConsumer


websocket_urlpatterns = [
    path('ws/workspaces/<slug:slug>/notifications/', NotificationConsumer.as_asgi()),
    path('ws/workspaces/<slug:slug>/goals/<uuid:goal_id>/discussion/', DiscussionConsumer.as_asgi()),
]