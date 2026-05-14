import secrets
from django.template.loader import render_to_string

from core.services.email_service import send_email as _send_email
from core.redis import store
from django.conf import settings


def generate_reset_token():
    return secrets.token_urlsafe(32)


def _make_key(reset_token):
    """make key for securly storing reset token to redis"""
    return store.make_key(prefix="password_reset", identifier=reset_token)


def save_reset_session(reset_token, email):
    store.set_data(_make_key(reset_token), email, timeout=60*60*24)


def get_reset_session(reset_token):
    return store.get_data(_make_key(reset_token))


def build_reset_url(reset_token):
    return f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"


def send_reset_email(email, reset_link):

    subject = "Reset Your Password"

    html_message = render_to_string(
        "emails/reset_password.html",
        {"reset_link": reset_link, "reset_link_expiry": "5 minutes"},
    )

    _send_email(
        subject=subject,
        to=[email],
        html_message=html_message,
    )
