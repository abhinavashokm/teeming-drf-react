from django.db.models import Prefetch

from core.exceptions.helpers import get_object_or_raise
from ..models import OutcomeMetric, OutcomeCheckIn, CheckInMetricValue


def get_metric_or_raise(workspace, metric_id):
    metric = get_object_or_raise(
        workspace=workspace,
        error_message="Metric not found",
        model=OutcomeMetric,
        id=metric_id,
    )
    return metric


def get_checkin_or_raise(workspace, checkin_id, select_related=None, prefetch_related=None):
    checkin = get_object_or_raise(
        workspace=workspace,
        error_message="Checkin not found",
        model=OutcomeCheckIn,
        id=checkin_id,
        select_related=select_related,
        prefetch_related=prefetch_related,
    )
    return checkin
