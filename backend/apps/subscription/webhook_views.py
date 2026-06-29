import stripe
import traceback

from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from . import subscription_services
from datetime import datetime, timezone
from django.db import transaction


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

                stripe_subscription = stripe.Subscription.retrieve(
                    session["subscription"]
                )

                expires_at = datetime.fromtimestamp(
                    stripe_subscription["items"]["data"][0]["current_period_end"],
                    timezone.utc,
                )

                print("expires at: ", expires_at)

                # with transaction.atomic():

                try:
                    with transaction.atomic():
                        subscription_services.create_workspace_subscription(
                            workspace_id=workspace_id,
                            plan_id=plan_id,
                            stripe_customer_id=session["customer"],
                            stripe_subscription_id=session["subscription"],
                            expires_at=expires_at,
                        )

                        # fetch the invoice and log it right here
                        invoice = stripe.Invoice.retrieve(session["invoice"])
                        if invoice and invoice["amount_paid"] > 0:
                            subscription_services.create_transaction_log(
                                stripe_subscription_id=session["subscription"],
                                amount=invoice["amount_paid"],
                                currency=invoice["currency"].upper(),
                                billing_period_start=datetime.fromtimestamp(invoice["period_start"], timezone.utc),
                                billing_period_end=datetime.fromtimestamp(invoice["period_end"], timezone.utc),
                                gateway_invoice_id=invoice["id"],
                                invoice_url=invoice["hosted_invoice_url"] if "hosted_invoice_url" in invoice else None,
                                is_renewal=False,
                            )
                except Exception:
                    traceback.print_exc()  # dumps full traceback to console/terminal
                    raise

            elif event["type"] == "invoice.payment_succeeded":
                invoice = event["data"]["object"]

                # skip initial payment — handled in checkout.session.completed
                if invoice["billing_reason"] == "subscription_create":
                    return Response(status=200)

                # only process renewals here
                if invoice["amount_paid"] == 0:
                    return Response(status=200)
                
                subscription_services.create_transaction_log(
                    stripe_subscription_id=invoice["subscription"],
                    amount=invoice["amount_paid"],
                    currency=invoice["currency"].upper(),
                    billing_period_start=datetime.fromtimestamp(invoice["period_start"], timezone.utc),
                    billing_period_end=datetime.fromtimestamp(invoice["period_end"], timezone.utc),
                    gateway_invoice_id=invoice["id"],
                    invoice_url=invoice.get("hosted_invoice_url"),
                    # first payment = PAYMENT, subsequent = RENEWAL
                    is_renewal=True,
                )

        except Exception as e:
            print(e)
            return Response(status=400)

        print("EVENT:", event["type"])

        return Response(status=200)
