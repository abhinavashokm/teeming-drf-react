from django.db import models

from core.models import WorkspaceScopedBaseModel


class DiscussionMessage(WorkspaceScopedBaseModel):

    goal = models.ForeignKey(
        "goal.Goal",
        on_delete=models.CASCADE,
        related_name="discussion_messages",
    )
    sender = models.ForeignKey(
        "user.User", on_delete=models.PROTECT, related_name="messages_sent"
    )
    content = models.TextField()

    class Meta:
        db_table = "discussion_messages"
        ordering = ["created_at"]
