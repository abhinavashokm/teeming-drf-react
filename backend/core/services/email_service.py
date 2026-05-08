from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .otp_service import format_otp_expiry


def send_verification_otp_email(email, otp):

    subject = "Verify Your Email Address"

    otp_expiry = format_otp_expiry(settings.OTP_EXPIRY)
    plain_message = f"""
Your OTP for email verification is: {otp}

This OTP is valid for {otp_expiry}.
"""

    html_message = render_to_string("emails/verification_otp.html", {"otp": otp, "otp_expiry": otp_expiry})

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
        html_message=html_message,
    )
