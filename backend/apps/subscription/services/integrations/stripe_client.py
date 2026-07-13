import stripe
from django.conf import settings


def create_plan_in_stripe(
    name,
    monthly_price,
    description=None,
):
    product_kwargs = {"name": name}
    if description:
        product_kwargs["description"] = description

    product = stripe.Product.create(**product_kwargs)

    price = stripe.Price.create(
        unit_amount=int(monthly_price * 100),
        currency="inr",
        recurring={"interval": "month"},
        product=product.id,
    )

    return {
        "product_id": product.id,
        "price_id": price.id,
    }


def create_checkout_session(workspace, plan):
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
        success_url=f"{settings.FRONTEND_URL}/w/{workspace.slug}/upgrade-plan/success",
        cancel_url=f"{settings.FRONTEND_URL}/w/{workspace.slug}/upgrade-plan/failed",
        metadata={"workspace_id": str(workspace.id), "plan_id": str(plan.id)},
    )

    return session


def create_price_for_product(product_id, monthly_price, currency):
    price = stripe.Price.create(
        product=product_id,
        unit_amount=int(monthly_price * 100),  # Stripe wants the smallest currency unit
        currency=currency.lower(),
        recurring={"interval": "month"},
    )
    return price.id


def modify_product(product_id, name, description):
    stripe.Product.modify(
        product_id,
        name=name,
        description=description or "",
    )


def cancel_subscription(stripe_subscription_id):
    stripe.Subscription.modify(
        stripe_subscription_id,
        cancel_at_period_end=True,
    )


def resume_subscription(stripe_subscription_id):
    stripe.Subscription.modify(
        stripe_subscription_id,
        cancel_at_period_end=False,
    )


def get_upcoming_invoice_preview(stripe_subscription_id, new_price_id):
    """
    Asks Stripe what the next invoice would look like if the given
    subscription's price were changed to `new_price_id` right now,
    with prorations applied. Does NOT charge anything or modify the
    subscription — read-only preview.
    """

    stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
    item_id = stripe_subscription["items"]["data"][0]["id"]

    upcoming_invoice = stripe.Invoice.create_preview(
        subscription=stripe_subscription_id,
        subscription_details={
            "items": [{"id": item_id, "price": new_price_id}],
            "proration_behavior": "always_invoice",
        },
    )

    return {
        "amount_due": upcoming_invoice["amount_due"],
        "currency": upcoming_invoice["currency"].upper(),
    }


def change_subscription_price(stripe_subscription_id, new_price_id):
    """
    Switches the subscription's price to `new_price_id`, charging the
    prorated difference immediately via an invoice. This is the real,
    billing version of get_upcoming_invoice_preview — it actually
    modifies the subscription and charges the customer's saved card.
    """

    stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
    item_id = stripe_subscription["items"]["data"][0]["id"]

    updated_subscription = stripe.Subscription.modify(
        stripe_subscription_id,
        items=[{"id": item_id, "price": new_price_id}],
        proration_behavior="always_invoice",
    )

    return updated_subscription


def schedule_plan_change(stripe_subscription_id, new_price_id):
    """
    Creates a Stripe Subscription Schedule from the existing subscription
    with two phases: the current plan running until the current period
    ends, then the new (lower) price taking over from the next cycle.
    No proration is applied at the transition — the user simply starts
    being billed the new price from the next billing date.

    Returns the created schedule.
    """

    stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
    current_price_id = stripe_subscription["items"]["data"][0]["price"]["id"]
    current_period_end = stripe_subscription["items"]["data"][0]["current_period_end"]

    schedule = stripe.SubscriptionSchedule.create(
        from_subscription=stripe_subscription_id,
    )

    stripe.SubscriptionSchedule.modify(
        schedule.id,
        end_behavior="release",
        phases=[
            {
                "items": [{"price": current_price_id, "quantity": 1}],
                "start_date": schedule["phases"][0]["start_date"],
                "end_date": current_period_end,
                "proration_behavior": "none",
            },
            {
                "items": [{"price": new_price_id, "quantity": 1}],
                "start_date": current_period_end,
                "proration_behavior": "none",
            },
        ],
    )

    return schedule


def release_subscription_schedule(schedule_id):
    """
    Cancels a pending downgrade by releasing the Subscription Schedule.
    The underlying subscription reverts to being managed directly,
    continuing on its current (un-downgraded) price.
    """

    return stripe.SubscriptionSchedule.release(schedule_id)


def retrieve_subscription(subscription_id):
    """
    Fetch a Stripe subscription by ID.
    Thin wrapper — no business logic, just the API call.
    """
    return stripe.Subscription.retrieve(subscription_id)


def retrieve_invoice(invoice_id):
    """
    Fetch a Stripe invoice by ID.
    Thin wrapper — no business logic, just the API call.
    """
    return stripe.Invoice.retrieve(invoice_id)
