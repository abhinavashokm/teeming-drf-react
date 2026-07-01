from decimal import Decimal

from django.db.models.functions import Coalesce
from django.db.models import Q, Count, Sum, DecimalField, Value

from ..models import Plan, WorkspaceSubscription, SubscriptionTransaction
from core.constants.plan_codes import PlanCode
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
