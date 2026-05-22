from rest_framework.views import APIView
from . import services
from .serializers import SendWorkspaceInvitationSerializer
from core.responses.api_response import success_response
from rest_framework import status


class SendWorkspaceInvitationView(APIView):

    def post(self, request, **kwargs):
        serializer = SendWorkspaceInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        services.send_workspace_invitations(
            serializer.validated_data["emails"],
            request.workspace,
            invited_by=request.user,
        )

        return success_response(message="good", status_code=status.HTTP_200_OK)


class ResolveInvitationTokenView(APIView):
    permission_classes = []

    def get(self, request, token):

        invitation_record = services.resolve_invitation_token(token)
        is_account_exists = services.check_account_exists(invitation_record.email)


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
                "role": "Member",
                "is_authenticated": request.user.is_authenticated,
            },
        )
