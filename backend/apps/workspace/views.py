from rest_framework.views import APIView
from core.responses.api_response import success_response, error_response
from rest_framework import status
from . import workspace_services
from .serializers import (
    CreateWorkspaceSerilaizer,
    WorkspaceRetrieveSerializer,
    WorkspaceMemberSerializer,
)
from .models import WorkspaceMember
from rest_framework.permissions import IsAuthenticated
from core.permission_views import MemberBaseView, AdminBaseView, OwnerBaseView


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


class WorkspaceRetrieveView(MemberBaseView):
    """Return current workspace."""

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
