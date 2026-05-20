from django.urls import path
from .views import WorkspaceSessionView, WorkspaceListCreateView, WorkspaceHomeView


urlpatterns = [
    path("", WorkspaceListCreateView.as_view()),
    path("session/", WorkspaceSessionView.as_view()),
    path("<slug:workspace_slug>/home/", WorkspaceHomeView.as_view())
]