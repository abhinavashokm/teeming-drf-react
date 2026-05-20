from django.urls import path
from .views import UserWorkspaceListView, WorkspaceView


urlpatterns = [
    path("me/", UserWorkspaceListView.as_view()),
    path("", WorkspaceView.as_view())
]