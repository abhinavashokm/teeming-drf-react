from django.db import models
from django.db.models import Q

from core.models import BaseAbstractModel


class Plan(BaseAbstractModel):

    class CurrencyChoices(models.TextChoices):
        INR = "INR", "Indian Rupee (₹)"
        USD = "USD", "US Dollar ($)"
        EUR = "EUR", "Euro (€)"
        GBP = "GBP", "British Pound (£)"
        CAD = "CAD", "Canadian Dollar (C$)"
        AUD = "AUD", "Australian Dollar (A$)"
        SGD = "SGD", "Singapore Dollar (S$)"
        JPY = "JPY", "Japanese Yen (¥)"

    code = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    max_goals = models.PositiveIntegerField(null=True, blank=True)
    max_members = models.PositiveIntegerField(null=True, blank=True)

    can_use_ai_idea_suggestions = models.BooleanField(default=False)
    can_use_ai_assistant = models.BooleanField(default=False)
    can_export_workspace_data = models.BooleanField(default=False)

    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(
        max_length=3, choices=CurrencyChoices.choices, default=CurrencyChoices.INR
    )

    stripe_product_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_price_id = models.CharField(max_length=255, null=True, blank=True)

    # field to determine plan sorting order
    tier = models.PositiveIntegerField()

    # --- new versioning fields ---
    version = models.PositiveIntegerField(default=1)
    is_archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(null=True, blank=True)
    replaced_by = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="previous_versions",
    )

    class Meta:
        db_table = "plans"
        ordering = ["tier", "version"]
        constraints = [
            # only one active version per code at a time
            models.UniqueConstraint(
                fields=["code", "version"], name="unique_plan_code_version"
            ),
            models.UniqueConstraint(
                fields=["code"],
                condition=models.Q(is_archived=False),
                name="unique_active_plan_code",
            ),
        ]


ACTIVE_STATUS = "active"


class WorkspaceSubscription(BaseAbstractModel):

    class StatusChoices(models.TextChoices):
        ACTIVE = (ACTIVE_STATUS, "Active")
        EXPIRED = ("expired", "Expired")
        CANCELLED = ("cancelled", "cancelled")
        TRIALING = "trialing", "Trialing"

    workspace = models.OneToOneField(
        "workspace.Workspace", on_delete=models.CASCADE, related_name="subscriptions"
    )
    plan = models.ForeignKey(
        Plan, on_delete=models.PROTECT, related_name="subscriptions"
    )
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(
        blank=True, null=True
    )  # it's a required field. made it option for temporary
    cancelled_at = models.DateTimeField(blank=True, null=True)

    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.ACTIVE
    )

    cancel_at_period_end = models.BooleanField(default=False)
    scheduled_plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="scheduled_subscriptions",
    )
    stripe_schedule_id = models.CharField(max_length=255, null=True, blank=True)

    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_subscription_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "workspace_subscription"
        indexes = [models.Index(fields=["workspace", "status"])]
        constraints = [
            # models.UniqueConstraint(
            #     fields=["workspace"],
            #     name="one_subscription_per_workspace",
            # ),
            models.UniqueConstraint(
                fields=["workspace"],
                condition=Q(status=ACTIVE_STATUS),
                name="one_active_subscription_per_workspace",
            ),
        ]


class SubscriptionTransaction(BaseAbstractModel):

    class TypeChoices(models.TextChoices):
        PAYMENT = "payment", "Payment"
        RENEWAL = "renewal", "Renewal"
        UPGRADE = "upgrade", "Upgrade"
        DOWNGRADE = "downgrade", "Downgrade"

    workspace = models.ForeignKey(
        "workspace.Workspace", on_delete=models.CASCADE, related_name="transactions"
    )
    subscription = models.ForeignKey(
        WorkspaceSubscription, on_delete=models.PROTECT, related_name="transactions"
    )
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)

    type = models.CharField(max_length=20, choices=TypeChoices.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)

    billing_period_start = models.DateTimeField()
    billing_period_end = models.DateTimeField()

    gateway_invoice_id = models.CharField(max_length=255, null=True, blank=True)
    invoice_url = models.URLField(null=True, blank=True)

    class Meta:
        db_table = "subscription_transactions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["workspace"]),
        ]
