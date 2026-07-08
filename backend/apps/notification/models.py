from django.db import models


class Notification(models.Model):

    class NotificationType(models.TextChoices):
        BOARD_RELATED     = "board_related", "Board Related"
        OUTCOME_RELATED     = "outcome_related", "Outcome Related"
        TEAM_RELATED = 'team_related', 'Team Related'

    recipient   = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='notifications')
    workspace   = models.ForeignKey('workspace.Workspace', on_delete=models.CASCADE)
    message     = models.CharField(max_length=255)
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

        #for redirect user to corresponding page when clicking notification
    notification_type  = models.CharField(max_length=30, default=NotificationType.BOARD_RELATED, choices=NotificationType.choices)
    target_id          = models.UUIDField(null=True, blank=True)  # id of the goal/comment/invite, etc.



    class Meta:
        ordering = ['-created_at']
        db_table = 'notifications'
