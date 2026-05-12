import secrets
from django.template.loader import render_to_string

from core.services.email_service import send_email
from django.conf import settings


def generate_otp():
    otp = str(secrets.randbelow(900000) + 100000)
    return otp


def _format_otp_expiry(seconds):

    if seconds % 60 == 0:
        minutes = seconds // 60
        return f"{minutes} minutes"

    return f"{seconds} seconds"


def send_verification_otp_email(email, otp):

    subject = "Verify Your Email Address"

    otp_expiry = _format_otp_expiry(settings.OTP_EXPIRY)
    plain_message = f"""
Your OTP for email verification is: {otp}

This OTP is valid for {otp_expiry}.
"""

    html_message = render_to_string(
        "emails/verification_otp.html", {"otp": otp, "otp_expiry": otp_expiry}
    )

    send_email(
        subject=subject,
        message=plain_message,
        to=[email],
        html_message=html_message,
    )
