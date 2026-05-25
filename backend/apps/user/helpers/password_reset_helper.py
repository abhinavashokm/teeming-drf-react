import secrets
from django.template.loader import render_to_string

from core.services.email_service import send_email as _send_email
from core import redis_store
from django.conf import settings
from core.utils.time_utils import seconds_to_human
from core.utils.token_utils import generate_token


def _make_key(reset_token):
    """make key for securly storing reset token to redis"""
    return redis_store.make_key(prefix="password_reset", identifier=reset_token)


def save_reset_session(reset_token, email):
    redis_store.set_data(_make_key(reset_token), email, timeout=settings.PASSWORD_RESET_LINK_EXPIRY)


def get_reset_session(reset_token):
    return redis_store.get_data(_make_key(reset_token))


def delete_reset_session(reset_token):
    return redis_store.delete_data(_make_key(reset_token))


def build_reset_url(reset_token):
    return f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"


def send_reset_email(email, reset_link):

    subject = "Reset Your Password"

    reset_link_expiry = seconds_to_human(settings.PASSWORD_RESET_LINK_EXPIRY)

    message = f"Click the link below to reset your password:\n\n{reset_link}\n\nThis link will expire in {reset_link_expiry}."

    html_message = render_to_string(
        "emails/reset_password.html",
        {"reset_link": reset_link, "reset_link_expiry": reset_link_expiry},
    )

    _send_email(
        subject=subject,
        message=message,
        to=[email],
        html_message=html_message,
    )
