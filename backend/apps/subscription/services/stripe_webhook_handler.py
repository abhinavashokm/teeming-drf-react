from datetime import datetime, timezone

from django.db import transaction

from . import subscription_services
from .integrations import stripe_client
from ..models import WorkspaceSubscription
from ..helpers.subscription_helper import get_free_plan


def process_event(event):
    """
    Entry point for the webhook view. Looks up a handler for the event
    type and runs it. Unrecognized event types are acknowledged (no-op)
    rather than raising, so Stripe doesn't retry events we don't care about.
    """
    handler = _EVENT_HANDLERS.get(event["type"])

    if handler is None:
        return

    handler(event["data"]["object"])


def _handle_checkout_session_completed(session):
    workspace_id = session["metadata"]["workspace_id"]
    plan_id = session["metadata"]["plan_id"]

    stripe_subscription = stripe_client.retrieve_subscription(session["subscription"])

    expires_at = _to_datetime(
        stripe_subscription["items"]["data"][0]["current_period_end"]
    )

    with transaction.atomic():

        subscription_services.create_workspace_subscription(
            workspace_id=workspace_id,
            plan_id=plan_id,
            stripe_customer_id=session["customer"],
            stripe_subscription_id=session["subscription"],
            expires_at=expires_at,
        )

        invoice = stripe_client.retrieve_invoice(session["invoice"])

        if invoice and invoice["amount_paid"] > 0:
            subscription_services.create_transaction_log(
                stripe_subscription_id=session["subscription"],
                amount=invoice["amount_paid"],
                currency=invoice["currency"].upper(),
                billing_period_start=_to_datetime(invoice["period_start"]),
                billing_period_end=_to_datetime(invoice["period_end"]),
                gateway_invoice_id=invoice["id"],
                invoice_url=(
                    invoice["hosted_invoice_url"]
                    if "hosted_invoice_url" in invoice
                    else None
                ),
                is_renewal=False,
            )


def _handle_invoice_paid(invoice):
    # The first invoice for a new subscription is already handled by
    # checkout.session.completed, so skip it here.
    if invoice["billing_reason"] == "subscription_create":
        return

    # Nothing was actually collected (e.g. a $0 invoice); nothing to log.
    if invoice["amount_paid"] == 0:
        return

    line = invoice["lines"]["data"][0]
    stripe_subscription_id = invoice["parent"]["subscription_details"]["subscription"]

    subscription_services.create_transaction_log(
        stripe_subscription_id=stripe_subscription_id,
        amount=invoice["amount_paid"],
        currency=invoice["currency"].upper(),
        billing_period_start=_to_datetime(line["period"]["start"]),
        billing_period_end=_to_datetime(line["period"]["end"]),
        gateway_invoice_id=invoice["id"],
        invoice_url=(
            invoice["hosted_invoice_url"] if "hosted_invoice_url" in invoice else None
        ),
        is_renewal=True,
    )


def _handle_subscription_updated(stripe_subscription):
    item = stripe_subscription["items"]["data"][0]

    subscription_services.sync_workspace_subscription(
        stripe_subscription_id=stripe_subscription["id"],
        stripe_status=stripe_subscription["status"],
        cancel_at_period_end=stripe_subscription["cancel_at_period_end"],
        stripe_price_id=item["price"]["id"],
        expires_at=_to_datetime(item["current_period_end"]),
    )


def _handle_subscription_ended(stripe_subscription):
    """
    Called when a Stripe subscription fully expires. Moves the workspace
    to the Free plan and clears all Stripe subscription state.
    """
    current = WorkspaceSubscription.objects.get(
        stripe_subscription_id=stripe_subscription["id"],
        status=WorkspaceSubscription.StatusChoices.ACTIVE,
    )

    free_plan = get_free_plan()

    with transaction.atomic():
        current.status = WorkspaceSubscription.StatusChoices.EXPIRED
        current.save(update_fields=["status"])

        WorkspaceSubscription.objects.create(
            workspace=current.workspace,
            plan=free_plan,
            stripe_customer_id=current.stripe_customer_id,
        )


def _to_datetime(timestamp):
    return datetime.fromtimestamp(timestamp, timezone.utc)


# Registry of event type -> handler. Add new Stripe event types here
# without touching the view or the dispatch logic.
_EVENT_HANDLERS = {
    "checkout.session.completed": _handle_checkout_session_completed,  # call when a checkout completed
    "invoice.paid": _handle_invoice_paid,  # call when money is debited from card
    "customer.subscription.updated": _handle_subscription_updated,  # fires on any subscription field change — period renewal, price change,
    # cancel_at_period_end toggle, schedule phase transition, payment status change
    # when downgrade plan actives it will trigger
    "customer.subscription.deleted": _handle_subscription_ended,  # call when a canceled subscription expired
}
