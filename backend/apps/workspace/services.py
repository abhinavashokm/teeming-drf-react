from .models import WorkspaceMember, Workspace, Invitation
from .helpers import invitationHelper
from core.utils.token_utils import generate_token
from core.utils.time_utils import format_expiry_date


def fetch_user_workspace_list(user):
    memberships = WorkspaceMember.objects.filter(user=user).select_related("workspace")

    membership_res = [
        {
            "id": m.workspace.id,
            "name": m.workspace.name,
            "slug": m.workspace.slug,
            "role": m.role,
        }
        for m in memberships
    ]

    last_workspace = Workspace.objects.filter(id=user.last_workspace).filter()
    last_workspace_res = {}

    if last_workspace:
        last_workspace_res = {
            "id": last_workspace.id,
            "slug": last_workspace.slug,
        }

    return membership_res, last_workspace_res


def send_workspace_invitations(emails, workspace, invited_by):
    """
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
                workspace=workspace,
                invited_by=invited_by,
                token=invitation_token,
                expires_at=expires_at,
            )
            for email in emails
        ]
    )

    invitationHelper.send_invite_mail(
        to=emails, expires_at=format_expiry_date(expires_at)
    )
