from rest_framework.views import APIView
from core.responses.api_response import success_response
from rest_framework import status
from . import services


class UserWorkspaceListView(APIView):

    def get(self, request):
        print(request.user)

        membership_workspaces, last_workspace = services.fetch_user_workspace_list(request.user)

        return success_response(
            data={
                "workspaces": membership_workspaces,
                "last_workspace": last_workspace,
            },
            status_code=status.HTTP_200_OK,
        )
