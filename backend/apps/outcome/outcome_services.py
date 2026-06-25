from django.db import transaction
from django.db.models import Prefetch
from django.utils import timezone

from .models import OutcomeMetric, OutcomeCheckIn, CheckInMetricValue
from apps.goal.helpers.goal_helper import get_goal_or_raise
from .helpers.outcome_helper import get_metric_or_raise, get_checkin_or_raise
from apps.notification import notification_services


def create_metrics(current_user, workspace, goal_id, data):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    metrics = OutcomeMetric.objects.bulk_create(
        [
            OutcomeMetric(
                created_by=current_user, workspace=workspace, goal=goal, **metricData
            )
            for metricData in data
        ]
    )

    return metrics


def list_goal_metrics(workspace, goal_id):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return OutcomeMetric.objects.in_workspace(workspace).filter(goal=goal)


def get_metric(workspace, metric_id):

    return get_metric_or_raise(workspace=workspace, metric_id=metric_id)


def delete_metric(workspace, metric_id):

    metric = get_metric_or_raise(workspace=workspace, metric_id=metric_id)

    metric.soft_delete()
    return


def create_checkin(current_user, workspace, goal_id, data):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    with transaction.atomic():

        checkin = OutcomeCheckIn.objects.create(
            created_by=current_user,
            workspace=workspace,
            goal=goal,
            status=data["status"],
            notes=data.get("notes"),
        )

        if data.get("metric_values"):
            CheckInMetricValue.objects.bulk_create(
                [
                    CheckInMetricValue(
                        workspace=workspace,
                        metric=mv["metric"],
                        value=mv["value"],
                        checkin=checkin,
                    )
                    for mv in data["metric_values"]
                ]
            )

        notification_services.notify_workspace_members(
            workspace=workspace,
            exclude_user=current_user,
            message=f'{current_user.full_name} added a new check-in for "{goal.name}"',
        )

        return checkin


def list_goal_checkins(workspace, goal_id):

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return (
        OutcomeCheckIn.objects.in_workspace(workspace)
        .select_related("created_by")
        .prefetch_related(
            Prefetch(
                "metric_values",
                queryset=CheckInMetricValue.objects.select_related("metric"),
            )
        )
        .filter(goal=goal).order_by("-created_at")
    )


def get_checkin(workspace, checkin_id):

    # helper with optimization queries included
    return get_checkin_or_raise(
        workspace=workspace,
        checkin_id=checkin_id,
        select_related=["created_by"],
        prefetch_related=[
            Prefetch(
                "metric_values",
                queryset=CheckInMetricValue.objects.select_related("metric"),
            )
        ],
    )


def delete_checkin(workspace, checkin_id):

    checkin = get_checkin_or_raise(workspace=workspace, checkin_id=checkin_id)
    checkin.soft_delete()

    # cascade soft delete
    checkin.metric_values.update(is_deleted=True, deleted_at=timezone.now())
