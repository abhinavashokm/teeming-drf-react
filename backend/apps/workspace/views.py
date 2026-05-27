from rest_framework.views import APIView
from core.responses.api_response import success_response, error_response
from rest_framework import status
from . import workspace_services
from .serializers import (
    CreateWorkspaceSerilaizer,
    WorkspaceRetrieveSerializer,
    WorkspaceMemberSerializer,
    WorkspaceUpdateSerializer,
    WorkspaceRoleUpdateSerializer,
)
from .models import WorkspaceMember
from rest_framework.permissions import IsAuthenticated
from core.permission_views import (
    MemberBaseView,
    AdminBaseView,
    OwnerBaseView,
    WorkspacePermissionBaseView,
)
from core.permissions import IsWorkspaceMember, IsWorkspaceAdmin, IsWorkspaceOwner


class WorkspaceSessionView(APIView):
    """
    Returns workspace session data for app initialization,
    including user workspaces and last visited workspace.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):

        membership_workspaces, last_workspace = (
            workspace_services.fetch_user_workspace_list(request.user)
        )

        return success_response(
            data={
                "workspaces": membership_workspaces,
                "last_workspace": last_workspace,
            },
            status_code=status.HTTP_200_OK,
        )


class WorkspaceDetailView(WorkspacePermissionBaseView):
    """Retrieve, Update, Delete current workspace."""

    permission_map = {
        "GET": [IsWorkspaceMember],
        "PATCH": [IsWorkspaceAdmin],
        "DELETE": [IsWorkspaceOwner],
    }

    def get(self, request, **kwargs):

        workspace_data = WorkspaceRetrieveSerializer(request.workspace).data

        return success_response(
            data={
                "workspace_id": workspace_data["id"],
                "name": workspace_data["name"],
                "slug": workspace_data["slug"],
                "role": request.member.get_role_display(),
            }
        )

    def patch(self, request, **kwargs):

        serializer = WorkspaceUpdateSerializer(
            request.workspace, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        workspace_services.update_workspace(
            workspace=request.workspace,
            data=serializer.validated_data,
        )

        return success_response(
            message="Workspace updated",
            data=serializer.validated_data,
            status_code=status.HTTP_200_OK,
        )

    def delete(self, request, **kwargs):

        workspace_services.delete_workspace(workspace=request.workspace)

        return success_response(
            message="Workspace deleted", status_code=status.HTTP_200_OK
        )


class WorkspaceListCreateView(APIView):
    """Perform workspace CRUD operations"""

    def post(self, request):
        serializer = CreateWorkspaceSerilaizer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        new_workspace = serializer.save()

        # add membership
        membership = WorkspaceMember.objects.create(
            user=request.user,
            workspace=new_workspace,
            role=WorkspaceMember.RoleChoices.OWNER,
        )

        return success_response(
            message="workspace created",
            data={
                "workspace_id": new_workspace.id,
                "slug": new_workspace.slug,
                "name": new_workspace.name,
                "role": membership.get_role_display(),
            },
            status_code=status.HTTP_201_CREATED,
        )


class WorkspaceHomeView(APIView):
    """Return initial data for the workspace home page."""

    def get(self, request, **kwargs):

        return success_response(
            message="very good",
            data={"name": request.workspace.name},
            status_code=status.HTTP_200_OK,
        )


class WorkspaceMemberListView(APIView):
    """
    Returns all the members of current workspace
    """

    def get(self, request, **kwargs):

        members = workspace_services.fetch_workspace_members(
            workspace=request.workspace
        )

        serializer = WorkspaceMemberSerializer(members, many=True)

        return success_response(
            data={"members": serializer.data}, status_code=status.HTTP_200_OK
        )


class WorkspaceMemberDetailView(WorkspacePermissionBaseView):
    permission_map = {"PATCH": [IsWorkspaceAdmin], "DELETE": [IsWorkspaceAdmin]}

    def patch(self, request, **kwargs):
        """change member role"""

        serializer = WorkspaceRoleUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        workspace_services.update_role(
            workspace=request.workspace,
            member_id=kwargs["member_id"],
            role=serializer.validated_data['role'],
        )

        return success_response(
            message="Role Updated",
            data=serializer.validated_data,
            status_code=status.HTTP_200_OK,
        )
    
    def delete(self, request, **kwargs):
        """remove member from workspace"""
        
        workspace_services.remove_member(
            workspace=request.workspace,
            member_id=kwargs['member_id'],
        )

        return success_response(
            message="removed user from workspace",
            status_code=status.HTTP_200_OK,
        )


class LeaveWorkspaceView(MemberBaseView):

    def delete(self, request, **kwargs):
        """remove current user's workspace membership"""

        workspace_services.leave_workspace(
            user=request.user,
            workspace=request.workspace,
        )

        return success_response(
            message="you left from workspace",
            status_code=status.HTTP_200_OK
        )