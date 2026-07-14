import stripe
import traceback

from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.subscription.services import stripe_webhook_handler


class StripeWebhookView(APIView):
    """
    Controller only. Verifies the Stripe signature, hands the parsed
    event to the service layer, and translates the outcome into an
    HTTP response. No business logic lives here.
    """
 
    authentication_classes = []
    permission_classes = []
 
    def post(self, request):
        payload = request.body
        signature = request.META.get("HTTP_STRIPE_SIGNATURE")
 
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )
            print("EVENT:", event["type"])
        except (ValueError, stripe.error.SignatureVerificationError):
            # Bad payload or bad signature -> reject before touching any service.
            traceback.print_exc()
            return Response(status=400)
 
        try:
            stripe_webhook_handler.process_event(event)
        except Exception:
            # Any failure while processing a known event type.
            traceback.print_exc()
            return Response(status=400)
 
        return Response(status=200)