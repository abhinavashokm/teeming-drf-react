import stripe
from django.conf import settings

def create_plan_in_stripe(
    name,
    description,
    monthly_price,
):
    product = stripe.Product.create(
        name=name,
        description=description,
    )

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
