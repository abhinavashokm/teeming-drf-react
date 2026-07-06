from celery import shared_task
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(self, subject, message, recipient_list, full_name, from_email=None):
    try:
        send_mail(
            subject,
            message,
            from_email or "noreply@example.com",
            recipient_list,
            fail_silently=False,
            html_message=render_to_string(
                "emails/welcome_mail.html",
                {"name": full_name, "login_url": settings.FRONTEND_URL},
            ),
        )
    except Exception as exc:
        # retry on transient failures (SMTP timeouts, etc.)
        raise self.retry(exc=exc)
