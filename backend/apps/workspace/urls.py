from django.urls import path, include
from .views import (
    ListUserWorkspacesView,
    WorkspaceListCreateView,
    WorkspaceHomeView,
    WorkspaceDetailView,
    WorkspaceMemberListView,
    WorkspaceMemberDetailView,
    LeaveWorkspaceView,
    WorkspaceLogoUploadURLView,
    SaveWorkspaceLogoUrlView,
    WorkspaceOnlineMembersView,
    RemoveWorkspaceLogoUrlView,
)

urlpatterns = [
    path("", WorkspaceListCreateView.as_view()),
    path("session/", ListUserWorkspacesView.as_view()),
    path(
        "<slug:slug>/",
        include([
                path("", WorkspaceDetailView.as_view()),
                path("home/", WorkspaceHomeView.as_view()),
                path("members/", WorkspaceMemberListView.as_view()),
                path(
                    "members/<uuid:member_id>/",
                    WorkspaceMemberDetailView.as_view(),
                ),
                path("members/leave/", LeaveWorkspaceView.as_view()),
                path("logo/", SaveWorkspaceLogoUrlView.as_view()),
                path("logo/upload-url/", WorkspaceLogoUploadURLView.as_view()),
                path("logo/remove/", RemoveWorkspaceLogoUrlView.as_view()),
                path("online-members/", WorkspaceOnlineMembersView.as_view()),
            ]),
    ),
]
