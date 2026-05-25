from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsWorkspaceMember, IsWorkspaceAdmin, IsWorkspaceOwner


"Permission hierarchy =  owner > admin > member"


class MemberBaseView(APIView):
    """Base view for all workspace-scoped views."""

    permission_classes = [IsAuthenticated, IsWorkspaceMember]


class AdminBaseView(APIView):
    """Base view for admin/owner-only workspace actions."""

    permission_classes = [IsAuthenticated, IsWorkspaceAdmin]


class OwnerBaseView(APIView):
    """Base view for owner-only workspace actions."""

    permission_classes = [IsAuthenticated, IsWorkspaceOwner]


class WorkspacePermissionBaseView(APIView):
    """
    Base view for views that require different workspace permissions per HTTP method.
        Usage:
        class WorkspaceDetailView(WorkspacePermissionBaseView):
            permission_map = {
                "GET": [IsWorkspaceMember],
                "PATCH": [IsWorkspaceAdmin],
                "DELETE": [IsWorkspaceOwner],
            }
    
    IsAuthenticated is always enforced. Only declare extra permissions per method.
    Unspecified methods default to IsAuthenticated only.
    """

    permission_map = {}

    def get_permissions(self):
        extra_permissions = self.permission_map.get(self.request.method, [])
        return [IsAuthenticated()] + [permission() for permission in extra_permissions]
