from rest_framework.views import APIView
from core.responses.api_response import success_response
from rest_framework import status
from . import workspace_services
from .serializers import (
    CreateWorkspaceSerilaizer,
    BaseWorkspaceSerializer,
    WorkspaceMemberSerializer,
    WorkspaceUpdateSerializer,
    WorkspaceRoleUpdateSerializer,
    MyWorkspacesSerializer,
)
from . import serializers
from rest_framework.permissions import IsAuthenticated
from core.permission_views import (
    MemberBaseView,
    WorkspacePermissionBaseView,
    AdminBaseView,
)
from core.permissions import IsWorkspaceMember, IsWorkspaceAdmin, IsWorkspaceOwner
from apps.subscription.services import subscription_services
from apps.goal import goal_services
from apps.user import user_services
from core.services import s3_service


class ListUserWorkspacesView(APIView):
    """
    Returns all workspaces the current user belongs to.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):

        memberships = workspace_services.fetch_user_workspace_list(
            user=request.user
        )

        return success_response(
            data={
                "memberships": serializers.MyWorkspacesSerializer(
                    memberships, many=True
                ).data,
            }
        )


class WorkspaceDetailView(WorkspacePermissionBaseView):
    """Retrieve, Update, Delete current workspace."""

    permission_map = {
        "GET": [IsWorkspaceMember],
        "PATCH": [IsWorkspaceAdmin],
        "DELETE": [IsWorkspaceOwner],
    }

    def get(self, request, **kwargs):

        subscription = subscription_services.get_current_subscription(
            workspace=request.workspace
        )

        limits = {
            "members": {
                "used": request.workspace.members.count(),
                "max": subscription.plan.max_members,
            },
            "goals": {
                "used": goal_services.get_workspace_goal_count(
                    workspace=request.workspace
                ),
                "max": subscription.plan.max_goals,
            },
        }

        features = {
            "AI_ENHANCEMENTS": subscription.plan.can_use_ai_enhancements,
            "ai_assistant": subscription.plan.can_use_ai_assistant,
        }

        user_services.update_last_visited_workspace(
            current_user=request.user,
            workspace=request.workspace,
        )

        workspace_data = serializers.GetCurrentWorkspaceSerializer(
            request.workspace,
            context={
                "member": request.member,
                "subscription": subscription,
                "limits": limits,
                "features": features,
            },
        ).data

        return success_response(data=workspace_data)

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

        new_workspace = workspace_services.create_workspace_with_free_plan(
            current_user=request.user, data=serializer.validated_data
        )

        return success_response(
            message="workspace created",
            data=BaseWorkspaceSerializer(new_workspace).data,
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

        members = workspace_services.fetch_workspace_members_ordered(
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
            role=serializer.validated_data["role"],
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
            member_id=kwargs["member_id"],
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
            message="you left from workspace", status_code=status.HTTP_200_OK
        )


class WorkspaceLogoUploadURLView(AdminBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.WorkspaceLogoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = s3_service.generate_workspace_logo_upload_url(
            workspace=request.workspace,
            content_type=serializer.validated_data["content_type"],
        )

        return success_response(data=data)


class SaveWorkspaceLogoUrlView(AdminBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.WorkspaceLogoSaveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        workspace_services.save_workspace_logo_url(
            workspace=request.workspace,
            logo_thumb_key=serializer.validated_data["logo_thumb_key"],
            logo_full_key=serializer.validated_data["logo_full_key"],
        )

        return success_response()


class RemoveWorkspaceLogoUrlView(AdminBaseView):

    def post(self, request, **kwargs):

        workspace_services.remove_workspace_logo(workspace=request.workspace)

        return success_response(
            message="Workspace logo removed"
        )


class WorkspaceOnlineMembersView(MemberBaseView):

    def get(self, request, **kwargs):

        online_members = workspace_services.get_online_members_user_id(
            workspace=request.workspace
        )
        return success_response(
            data={"online_members": online_members},
        )
