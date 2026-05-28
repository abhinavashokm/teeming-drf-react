from .helpers import invitationHelper
from core.utils.token_utils import generate_token
from core.utils.time_utils import format_expiry_date
from .models import Invitation
from . import exceptions
from django.utils import timezone
from apps.user.models import User
from apps.workspace import workspace_services as workspace_services
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise


def send_workspace_invitations(emails, role, workspace, invited_by):
    """542238 
    Invite a list of users to a workspace.

    Each email gets a unique token and shared expiry.
    Invitations are bulk created, then invite emails are dispatched.
    """

    invitation_token = generate_token()
    expires_at = invitationHelper.get_invitation_expiry()

    Invitation.objects.bulk_create(
        [
            Invitation(
                email=email,
                role=role,
                workspace=workspace,
                invited_by=invited_by,
                token=invitation_token,
                expires_at=expires_at,
            )
            for email in emails
        ]
    )

    invite_link = invitationHelper.generate_invite_link(invitation_token)

    invitationHelper.send_invite_mail(
        to=emails, expires_at=format_expiry_date(expires_at), invite_link=invite_link, workspace=workspace.name
    )


def resolve_invitation_token(token):

    invitation = (
        Invitation.objects.select_related("workspace", "invited_by")
        .filter(token=token)
        .first()
    )

    if not invitation:
        raise exceptions.InvalidInviteToken()

    if invitation.expires_at < timezone.now():
        raise exceptions.InvalidInviteToken()

    if invitation.status == Invitation.StatusChoices.ACCEPTED:
        raise exceptions.InvalidInviteToken()

    return invitation


def check_account_exists(email):
    return User.objects.filter(email=email).exists()


def verify_token_and_accept_invitation(invitation_token, user):

    invitation = resolve_invitation_token(invitation_token)

    # verify workspace still exists
    workspace = get_workspace_or_raise(
        workspace_id=invitation.workspace.id
    )

    # put role as default for now
    workspace_services.add_workspace_member(
        user=user, workspace=workspace, role=invitation.role
    )

    return invitation.workspace


def fetch_invitations(workspace, invitation_status):
    invitations = Invitation.objects.in_workspace(workspace).select_related('invited_by')

    if invitation_status:
        invitations = invitations.filter(status=invitation_status)

    return invitations
