from rest_framework.views import APIView
from . import invitation_services
from .serializers import SendWorkspaceInvitationSerializer
from core.responses.api_response import success_response
from rest_framework import status
from .serializers import JoinedWorkspaceSerializer, InvitationsReadSerializer
from core.permission_views import AdminBaseView


class InvitationListCreateView(AdminBaseView):

    def post(self, request, **kwargs):
        """create and send workspace invitations"""

        serializer = SendWorkspaceInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation_services.send_workspace_invitations(
            emails=serializer.validated_data["emails"],
            role=serializer.validated_data["role"],
            workspace=request.workspace,
            invited_by=request.user,
        )

        return success_response(
            message="Invitations sent", status_code=status.HTTP_200_OK
        )

    def get(self, request, **kwargs):
        """fetch all the invitations of current workspace"""

        invitation_status = request.query_params.get("status")

        invitations = invitation_services.fetch_invitations(
            workspace=request.workspace, invitation_status=invitation_status
        )

        return success_response(
            status_code=status.HTTP_200_OK,
            data={
                "pending_invitations": InvitationsReadSerializer(
                    invitations, many=True
                ).data
            },
        )


class ResolveInvitationTokenView(APIView):
    permission_classes = []

    def get(self, request, token):

        invitation_record = invitation_services.resolve_invitation_token(token)
        is_account_exists = invitation_services.check_account_exists(
            invitation_record.email
        )

        workspace = invitation_record.workspace
        invited_user = invitation_record.invited_by

        return success_response(
            status_code=status.HTTP_200_OK,
            data={
                "workspace": {
                    "id": workspace.id,
                    "name": workspace.name,
                    "slug": workspace.slug,
                },
                "invited_email": invitation_record.email,
                "account_exists": is_account_exists,
                "invited_by": invited_user.full_name,
                "role": invitation_record.get_role_display(),
                "is_authenticated": request.user.is_authenticated,
            },
        )


class AcceptInvitationView(APIView):

    def post(self, request, token):

        joined_workspace = invitation_services.verify_token_and_accept_invitation(
            token, request.user
        )

        return success_response(
            message="Invitation accepted",
            data={"joined_workspace": JoinedWorkspaceSerializer(joined_workspace).data},
            status_code=status.HTTP_201_CREATED,
        )
