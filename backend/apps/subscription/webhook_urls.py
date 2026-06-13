from django.urls import path

from .webhook_views import StripeWebhookView

urlpatterns = [
    path(
        "stripe/",
        StripeWebhookView.as_view(),
        name="stripe-webhook"
    ),
]