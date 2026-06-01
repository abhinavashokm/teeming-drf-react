from django.template.loader import render_to_string

from core.services.email_service import send_email
from core.utils.time_utils import get_expiry_datetime
from django.conf import settings
from core.exceptions.helpers import get_object_or_raise
from ..models import Invitation


def get_invitation_expiry():
    expiry = get_expiry_datetime(settings.INVITATION_EXPIRY)
    # snap to end of that day
    # invitation will valid for exactly next N days (until end of last day)
    return expiry.replace(hour=23, minute=59, second=59, microsecond=0)


def generate_invite_link(token):
    return f"{settings.FRONTEND_URL}/invite?token={token}"


def send_invite_mail(to, expires_at, invite_link, workspace):
    subject = f"You're invited to join {workspace}"

    plain_message = f"""
You've been invited to join {workspace} workspace on Teeming.

Click the link below to accept your invitation:
{invite_link}

This invite link will expire in 48 hours.
"""

    html_message = render_to_string(
        "emails/workspace_invitation.html",
        {"invite_link": invite_link, "invitation_expiry": expires_at, "workspace": workspace},
    )

    send_email(
        subject=subject,
        message=plain_message,
        to=to,
        html_message=html_message,
    )


def get_invitation_or_raise(workspace, invitation_id):
    invitation = get_object_or_raise(
        workspace=workspace,
        id= invitation_id,
        model=Invitation,
        error_message="Invitation not found"
    )

    return invitation
