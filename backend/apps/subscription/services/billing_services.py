from decimal import Decimal
from datetime import date, timedelta


from django.db.models.functions import TruncDay, TruncMonth, TruncYear, Coalesce
from django.db.models import Q, Count, Sum, DecimalField, Value

from ..models import Plan, WorkspaceSubscription, SubscriptionTransaction
from apps.subscription.constants import PlanCode
from apps.workspace.models import Workspace, WorkspaceMember


def get_billing_overview():
    return {
        "overview": _get_overview(),
        "plan_distribution": _get_plan_distribution(),
        "top_paying_workspaces": _get_top_paying_workspaces(),
    }


def _get_overview():
    active_subscriptions = WorkspaceSubscription.objects.filter(
        status=WorkspaceSubscription.StatusChoices.ACTIVE
    ).exclude(plan__code=PlanCode.FREE)

    total_revenue = SubscriptionTransaction.objects.aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(Decimal("0.00")),
            output_field=DecimalField(max_digits=10, decimal_places=2),
        )
    )["total"]

    return {
        "total_revenue": total_revenue,
        "active_subscriptions": active_subscriptions.count(),
        "total_workspaces": Workspace.objects.count(),
        "total_members": WorkspaceMember.objects.count(),
    }


def _get_plan_distribution():
    total = WorkspaceSubscription.objects.filter(
        status=WorkspaceSubscription.StatusChoices.ACTIVE
    ).count()

    plans = (
        Plan.objects.filter(is_archived=False)
        .annotate(
            count=Count(
                "subscriptions",
                filter=Q(
                    subscriptions__status=WorkspaceSubscription.StatusChoices.ACTIVE
                ),
            )
        )
        .order_by("tier")
    )

    return [
        {
            "code": plan.code,
            "name": plan.name,
            "count": plan.count,
            "percentage": round((plan.count / total) * 100, 1) if total else 0,
        }
        for plan in plans
    ]


def _get_top_paying_workspaces(limit=5):
    top = (
        SubscriptionTransaction.objects.values("workspace_id", "workspace__name")
        .annotate(total_revenue=Sum("amount"))
        .order_by("-total_revenue")[:limit]
    )

    workspace_ids = [row["workspace_id"] for row in top]

    current_plans = dict(
        WorkspaceSubscription.objects.filter(
            workspace_id__in=workspace_ids,
            status=WorkspaceSubscription.StatusChoices.ACTIVE,
        ).values_list("workspace_id", "plan__name")
    )

    return [
        {
            "id": row["workspace_id"],
            "name": row["workspace__name"],
            "plan": current_plans.get(row["workspace_id"], "—"),
            "amount": row["total_revenue"],
        }
        for row in top
    ]

ZERO = Decimal("0.00")

def _granularity_for_range(start: date, end: date) -> str:
    total_days = (end - start).days + 1
    if total_days > 730:
        return "year"
    if total_days > 45:
        return "month"
    return "day"


def _label_for_bucket(bucket: date, granularity: str) -> str:
    if granularity == "day":
        return bucket.strftime("%b %-d")       # "Jun 1"
    if granularity == "month":
        return bucket.strftime("%b '%y")        # "Jun '26"
    return str(bucket.year)                      # "2026"


def _bucket_starts(start: date, end: date, granularity: str):
    """Yields every bucket start date in range, even ones with no transactions."""
    if granularity == "day":
        cursor = start
        while cursor <= end:
            yield cursor
            cursor += timedelta(days=1)

    elif granularity == "month":
        cursor = start.replace(day=1)
        while cursor <= end:
            yield cursor
            cursor = date(cursor.year + 1, 1, 1) if cursor.month == 12 else date(cursor.year, cursor.month + 1, 1)

    else:  # year
        cursor = date(start.year, 1, 1)
        while cursor <= end:
            yield cursor
            cursor = date(cursor.year + 1, 1, 1)


TRUNC_FN = {"day": TruncDay, "month": TruncMonth, "year": TruncYear}


def get_revenue_series(start: date, end: date) -> dict:
    granularity = _granularity_for_range(start, end)
    trunc_fn = TRUNC_FN[granularity]

    rows = (
        SubscriptionTransaction.objects.filter(created_at__date__gte=start, created_at__date__lte=end)
        .annotate(bucket=trunc_fn("created_at"))
        .values("bucket")
        .annotate(total=Sum("amount"))
    )
    amounts_by_bucket = {row["bucket"].date(): row["total"] for row in rows}

    series = [
        {
            "label": _label_for_bucket(bucket, granularity),
            "amount": str(amounts_by_bucket.get(bucket, ZERO)),
        }
        for bucket in _bucket_starts(start, end, granularity)
    ]

    total = sum((Decimal(point["amount"]) for point in series), ZERO)

    return {
        "total": str(total),
        "granularity": granularity,
        "series": series,
    }
