from rest_framework.views import APIView
from core.responses.api_response import success_response, error_response
from rest_framework import status
from . import workspace_services
from .serializers import CreateWorkspaceSerilaizer, WorkspaceSerializer
from .models import WorkspaceMember


class WorkspaceSessionView(APIView):
    """
    Returns workspace session data for app initialization,
    including user workspaces and last visited workspace.
    """

    def get(self, request):


        membership_workspaces, last_workspace = workspace_services.fetch_user_workspace_list(
            request.user
        )

        return success_response(
            data={
                "workspaces": membership_workspaces,
                "last_workspace": last_workspace,
            },
            status_code=status.HTTP_200_OK,
        )


class WorkspaceDetailView(APIView):
    """
    fetch details of current workspace
    """

    def get(self, request, **kwargs):

        workspace = request.workspace
        workspace_data = WorkspaceSerializer(request.workspace).data

        # get user role in this workspace
        member_q = WorkspaceMember.objects.filter(
            workspace=workspace, user=request.user
        )

        if not member_q.exists():
            return error_response(
                message="you are not member broh", status_code=status.HTTP_404_NOT_FOUND
            )

        member = member_q.first()

        return success_response(
            data={
                "workspace_id": workspace_data["id"],
                "name": workspace_data["name"],
                "slug": workspace_data["slug"],
                "role": member.get_role_display(),
            }
        )


class WorkspaceListCreateView(APIView):

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

    def get(self, request):

        return success_response(message="good")


class WorkspaceHomeView(APIView):

    def get(self, request, **kwargs):

        return success_response(
            message="very good",
            data={"name": request.workspace.name},
            status_code=status.HTTP_200_OK,
        )
    

