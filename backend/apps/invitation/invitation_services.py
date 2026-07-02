from .helpers import invitationHelper
from core.utils.token_utils import generate_token
from core.utils.time_utils import format_expiry_date
from .models import Invitation
from . import exceptions
from apps.user.models import User
from django.utils import timezone
from apps.workspace import workspace_services as workspace_services
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from django.db import transaction
from apps.subscription.services import entitlements
from apps.subscription.constants import Limits


def send_workspace_invitations(emails, role, workspace, invited_by):
    """
    Invite a list of users to a workspace.

    Each email gets a unique token and shared expiry.
    Invitations are bulk created, then invite emails are dispatched.
    """
    #guard to ensure worksapce not exceded max member limit of current plan
    entitlements.raise_if_limit_exceeded(
        workspace=workspace,
        limit_field=Limits.MAX_MEMBERS,
        current_count=workspace_services.get_workspace_members_count(
            workspace=workspace
        ),
    )

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
        to=emails,
        expires_at=format_expiry_date(expires_at),
        invite_link=invite_link,
        workspace=workspace.name,
    )


def resolve_invitation_token(invitation_token):
    """verify and return the invitation record"""

    invitation = (
        Invitation.objects.select_related("workspace", "invited_by")
        .filter(token=invitation_token)
        .first()
    )

    if not invitation:
        raise exceptions.InvalidInviteToken()

    if invitation.is_expired:
        raise exceptions.InvalidInviteToken()

    # if invitation.status == Invitation.StatusChoices.ACCEPTED:
    #     raise exceptions.InvitationAlreadyAccepted()

    return invitation


def check_account_exists(email):
    return User.objects.filter(email=email).exists()


def verify_token_and_accept_invitation(invitation_token, user):
    """
    Accept a workspace invitation for the given user.

    Validates the invitation token, verifies that the invitation
    belongs to the current user, adds the user to the workspace
    with the invited role, and marks the invitation as accepted.

    Returns:
        Workspace: The workspace that was joined.

    Raises:
        InvalidInviteToken:
        -If the token is invalid or does not belong to the current user.
        -If the invitation has expired.
        WorkspaceNotFound:If the workspace no longer exists.
    """

    invitation = resolve_invitation_token(invitation_token=invitation_token)

    # check if invite is for current user
    if not invitation.email == user.email:
        print(invitation.email, user.email)
        raise exceptions.InvitationEmailMismatch()

    # verify workspace still exists
    workspace = get_workspace_or_raise(workspace_id=invitation.workspace.id)

    #guard to ensure worksapce not exceded max member limit of current plan
    entitlements.raise_if_limit_exceeded(
        workspace=workspace,
        limit_field=Limits.MAX_MEMBERS,
        current_count=workspace_services.get_workspace_members_count(
            workspace=workspace
        ),
        error_message="Workspace member limit exceeded."
    )

    with transaction.atomic():
        # put role as default for now
        workspace_services.add_workspace_member(
            user=user, workspace=workspace, role=invitation.role
        )

        # update invitation as accepted
        invitation.status = Invitation.StatusChoices.ACCEPTED
        invitation.accepted_at = timezone.now()
        invitation.save()

        return invitation.workspace


def fetch_pending_invitations(workspace):
    invitations = (
        Invitation.objects.in_workspace(workspace)
        .filter(status=Invitation.StatusChoices.PENDING)
        .select_related("invited_by")
    )

    return invitations


def cancel_invitation(workspace, invitation_id):

    invitation = invitationHelper.get_invitation_or_raise(
        workspace=workspace, invitation_id=invitation_id
    )

    invitation.is_deleted = True
    invitation.save(update_fields=["is_deleted"])
