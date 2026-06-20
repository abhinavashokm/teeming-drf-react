from django.db import models
from django.conf import settings

from core.models import WorkspaceScopedBaseModel

class AIAssistantResponse(WorkspaceScopedBaseModel):

    class ResponseType(models.TextChoices):
        SUMMARY = "summary", "Summary"
        BLOCKERS = "blockers", "Blockers"
        IDEA_SUGGESTIONS = "idea_suggestions", "Idea Suggestions"
        CUSTOM_CHAT = "custom_chat", "Custom Chat"

    goal = models.ForeignKey(
        "goal.Goal",
        on_delete=models.CASCADE,
        related_name="ai_insights"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_insights"
    )

    type = models.CharField(
        max_length=30,
        choices=ResponseType.choices
    )

    request_text = models.TextField(blank=True, null=True) 

    content = models.JSONField()

    is_shared = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"{self.title} ({self.type})"

    class Meta:
        db_table='ai_assistant_responses'