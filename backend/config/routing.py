from django.urls import path
from apps.workspace.consumers import WorkspaceConsumer


websocket_urlpatterns = [
    path('ws/workspaces/<slug:slug>/', WorkspaceConsumer.as_asgi()),
]