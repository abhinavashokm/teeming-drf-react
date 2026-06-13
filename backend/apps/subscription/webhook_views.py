import stripe

from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from . import subscription_services


class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.body

        signature = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )

            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]

                workspace_id = session["metadata"]["workspace_id"]
                plan_id = session["metadata"]["plan_id"]

                subscription_services.create_workspace_subscription(
                    workspace_id=workspace_id,
                    plan_id=plan_id,
                    stripe_customer_id=session["customer"],
                    stripe_subscription_id=session["subscription"],
                )

        except Exception as e:
            print(e)
            return Response(status=400)

        print("EVENT:", event["type"])

        return Response(status=200)
