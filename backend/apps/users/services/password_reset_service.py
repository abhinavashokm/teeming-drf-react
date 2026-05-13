import secrets
import hashlib
from django.template.loader import render_to_string
from django.conf import settings

from core.services.email_service import send_email as _send_email
from core.redis.store import set_data, get_data


def _make_key(reset_token):
    """make key for securly storing reset token to redis"""
    
    hashed_reset_token = hashlib.sha256(reset_token.encode()).hexdigest()

    return f"password_reset:{hashed_reset_token}"


def _save_reset_token(reset_token, email):

    set_data(_make_key(reset_token), {"email": email}, timeout=60*60*24)


def _get_reset_token_owner(reset_token):

    return get_data(_make_key(reset_token))


def _send_reset_email(email, reset_link):

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


def send_password_reset_mail(email):

    reset_token = secrets.token_urlsafe(32)

    #store reset token in redis for verification
    _save_reset_token(reset_token, email)

    #build reset url to send to user
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"

    _send_reset_email(email, reset_url)


def verify_reset_token(token):
    
    #check and return token + user_data from redis
    user_data = _get_reset_token_owner(token)

    if not user_data:
        return False
    
    return user_data