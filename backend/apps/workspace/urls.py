from django.urls import path
from .views import (
    WorkspaceSessionView,
    WorkspaceListCreateView,
    WorkspaceHomeView,
    WorkspaceRetrieveView,
    WorkspaceMemberListView,
)

urlpatterns = [
    path("", WorkspaceListCreateView.as_view()),
    path("session/", WorkspaceSessionView.as_view()),
    
    path("<slug:slug>/", WorkspaceRetrieveView.as_view()),
    path("<slug:slug>/home/", WorkspaceHomeView.as_view()),
    path("<slug:slug>/members/", WorkspaceMemberListView.as_view())
]
