from rest_framework.views import APIView
from core.responses.api_response import success_response
from rest_framework import status
from rest_framework.permissions import AllowAny
from . import services
from .serializers import CreateWorkspaceSerilaizer


class UserWorkspaceListView(APIView):

    def get(self, request):
        print(request.user)

        membership_workspaces, last_workspace = services.fetch_user_workspace_list(
            request.user
        )

        return success_response(
            data={
                "workspaces": membership_workspaces,
                "last_workspace": last_workspace,
            },
            status_code=status.HTTP_200_OK,
        )


class WorkspaceView(APIView):

    def post(self, request):
        serializer = CreateWorkspaceSerilaizer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        new_workspace = serializer.save()

        return success_response(
            message="workspace created",
            data={
                "workspace_id": new_workspace.id,
                "slug": new_workspace.slug,
                "name": new_workspace.name,
            },
            status_code=status.HTTP_201_CREATED,
        )
