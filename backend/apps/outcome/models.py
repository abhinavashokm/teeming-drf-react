from django.db import models
from core.models import WorkspaceScopedBaseModel


class OutcomeMetric(WorkspaceScopedBaseModel):

    class UnitChoices(models.TextChoices):
        PERCENTAGE = ("percentage", "Percentage")
        NUMBER = ("number", "Number")
        CURRENCY = ("currency", "Currency")
        HOURS = ("hours", "Hours")
        DAYS = ("days", "Days")
        SCORE = ("score", "Score")

    goal = models.ForeignKey(
        "goal.Goal", on_delete=models.CASCADE, related_name="outcome_metrics"
    )
    name = models.CharField(max_length=255)
    baseline_value = models.FloatField(blank=True, null=True)
    target_value = models.FloatField(blank=True, null=True)
    unit = models.CharField(max_length=20, choices=UnitChoices, default=UnitChoices.NUMBER)

    class Meta:
        db_table = "outcome_metrics"


class OutcomeCheckIn(WorkspaceScopedBaseModel):

    class StatusChoices(models.TextChoices):
        MEASURING = ('measuring', "Still Measuring")
        PROMISING = ('promising', "Looking Promising")
        ACHIEVED = ('achieved', "Goal Achieved")
        NOT_WORKING = ('not_working', 'Not Working')


    goal = models.ForeignKey(
        "goal.Goal", on_delete=models.CASCADE, related_name="outcome_checkins"
    )
    created_by = models.ForeignKey(
        "user.User", on_delete=models.PROTECT, related_name="created_checkins"
    )
    status = models.CharField(max_length=20, choices=StatusChoices, default=StatusChoices.MEASURING)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "outcome_checkins"


class CheckInMetricValue(WorkspaceScopedBaseModel):

    checkin = models.ForeignKey(
        OutcomeCheckIn, on_delete=models.CASCADE, related_name="metric_values"
    )
    metric = models.ForeignKey(
        OutcomeMetric, on_delete=models.PROTECT, related_name="recorded_values" 
    )
    value = models.FloatField()

    class Meta:
        db_table = 'checkin_metric_values'
        unique_together = ('checkin', 'metric')

