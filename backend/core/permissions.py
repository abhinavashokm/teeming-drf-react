from rest_framework.permissions import BasePermission
from apps.workspace.models import WorkspaceMember

"Permission hierarchy =  owner > admin > member"


class IsWorkspaceMember(BasePermission):
    """Allow access only to members of the current workspace."""

    def has_permission(self, request, view):
        member = WorkspaceMember.objects.filter(
            workspace=request.workspace,
            user=request.user,
        ).first()

        if not member:
            return False
        
        request.member = member
        return True


class IsWorkspaceAdmin(BasePermission):
    "Allow access only to admin or owner of the current workspace."

    def has_permission(self, request, view):
        if not IsWorkspaceMember().has_permission(request, view):
            return False
        
        return request.member.role in [
            WorkspaceMember.RoleChoices.ADMIN,
            WorkspaceMember.RoleChoices.OWNER,
        ]


class IsWorkspaceOwner(BasePermission):
    "Allow access only to owner of the current workspace"

    def has_permission(self, request, view):
        if not IsWorkspaceMember().has_permission(request, view):
            return False
        
        return request.member.role == WorkspaceMember.RoleChoices.OWNER
