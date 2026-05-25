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
