from django.db import models
from core.models import WorkspaceScopedBaseModel


class Goal(WorkspaceScopedBaseModel):

    class StatusChoices(models.TextChoices):
        DRAFT = "draft", "Draft"
        ACTIVE = "active", "Active"
        ON_HOLD = "on_hold", "On Hold"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    created_by = models.ForeignKey(
        "user.User", on_delete=models.PROTECT, related_name="created_goals"
    )
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=15, choices=StatusChoices.choices, default=StatusChoices.DRAFT
    )

    description = models.TextField(null=True, blank=True)
    target_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "goals"


class StarredGoal(WorkspaceScopedBaseModel):

    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='stars')
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='starred_goals')

    class Meta:
        db_table = "starred_goals"
        unique_together = ['goal', 'user']

