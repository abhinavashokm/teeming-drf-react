from django.db import models

from core.models import WorkspaceScopedBaseModel


class Idea(WorkspaceScopedBaseModel):

    class StatusChoices(models.TextChoices):
        DRAFT = "draft", "Draft"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE = "done", "Done"

    goal = models.ForeignKey(
        "goal.Goal", on_delete=models.CASCADE, related_name="ideas"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.DRAFT
    )

    created_by = models.ForeignKey(
        "user.User", on_delete=models.PROTECT, related_name="created_ideas"
    )

    class Meta:
        db_table = "ideas"

    @property
    def moved_to_progress_history(self):
        return self.status_history.filter(
            to_status=self.StatusChoices.IN_PROGRESS
        ).first()

    @property
    def moved_to_done_history(self):
        return self.status_history.filter(to_status=self.StatusChoices.DONE).first()


class IdeaStatusHistory(WorkspaceScopedBaseModel):
    """
    for storing staus changes of a idea
    eg: - suggestion  -> in progress
        - in progress -> done
    no status history for creating an idea initially, since there is no practical use
    """

    idea = models.ForeignKey(
        "idea.Idea", on_delete=models.CASCADE, related_name="status_history"
    )
    changed_by = models.ForeignKey(
        "user.User",
        on_delete=models.PROTECT,
        related_name="idea_status_changes",
    )

    from_status = models.CharField(max_length=20, choices=Idea.StatusChoices.choices)
    to_status = models.CharField(max_length=20, choices=Idea.StatusChoices.choices)

    note = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "idea_status_history"


class IdeaAssignment(WorkspaceScopedBaseModel):
    """an idea can be assigned to multiple members"""

    idea = models.ForeignKey(
        "idea.Idea", on_delete=models.CASCADE, related_name="assignments"
    )

    assignee = models.ForeignKey(
        "user.User",
        on_delete=models.PROTECT,
        related_name="assigned_ideas",
    )
    assigned_by = models.ForeignKey(
        "user.User", on_delete=models.PROTECT, related_name="idea_assignments_made"
    )

    class Meta:
        db_table = "idea_assignments"
        unique_together = ("idea", "assignee")
