from django.conf import settings
from django.core.mail import send_mail
from .otp_service import generate_otp

class EmailService:

    @staticmethod
    def create_and_send_otp(email):

        otp = generate_otp()

        subject = "Email Verification OTP"

        message = f"Your OTP for account verification is: {otp}"

        from_email = settings.EMAIL_HOST_USER

        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[email],
            fail_silently=False,
        )