# core/tasks.py

from celery import shared_task
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(self, subject, template_name, context, recipient_list, plain_message="", from_email=None):
    try:
        html_message = render_to_string(template_name, context)
        send_mail(
            subject,
            message=plain_message,
            from_email=from_email or settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
            html_message=html_message,
        )
        logger.info(f"Email sent to {recipient_list}")
    except Exception as exc:
        logger.exception(f"Email send failed for {recipient_list}")
        raise self.retry(exc=exc)