from django.urls import path
from .views import (
    WorkspaceSessionView,
    WorkspaceListCreateView,
    WorkspaceHomeView,
    WorkspaceDetailView,
    WorkspaceMemberListView,
    WorkspaceMemberDetailView,
    LeaveWorkspaceView,
)

urlpatterns = [
    path("", WorkspaceListCreateView.as_view()),
    path("session/", WorkspaceSessionView.as_view()),
    path("<slug:slug>/", WorkspaceDetailView.as_view()),
    path("<slug:slug>/home/", WorkspaceHomeView.as_view()),
    path("<slug:slug>/members/", WorkspaceMemberListView.as_view()),
    path("<slug:slug>/members/<uuid:member_id>/", WorkspaceMemberDetailView.as_view()),
    path("<slug:slug>/members/leave/", LeaveWorkspaceView.as_view()),
]
