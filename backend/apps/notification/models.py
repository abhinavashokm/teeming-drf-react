from django.db import models


class Notification(models.Model):
    recipient   = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='notifications')
    workspace   = models.ForeignKey('workspace.Workspace', on_delete=models.CASCADE)
    message     = models.CharField(max_length=255)
    is_read     = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
