import secrets

from django.conf import settings
from core.utils.time_utils import seconds_to_human
from core import tasks


def generate_otp():
    otp = str(secrets.randbelow(900000) + 100000)
    return otp


def send_verification_otp_email(email, otp):

    subject = "Verify Your Email Address"

    otp_expiry = seconds_to_human(settings.OTP_EXPIRY)
    
    plain_message = f"""
Your OTP for email verification is: {otp}

This OTP is valid for {otp_expiry}.
"""

    tasks.send_email_task.delay(
        subject=subject,
        plain_message=plain_message,
        template_name="emails/verification_otp.html",
        context= {"otp": otp, "otp_expiry": otp_expiry},
        recipient_list=[email]
    )
