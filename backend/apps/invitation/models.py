import uuid

from django.db import models
from django.conf import settings


# Create your models here.
class Invitation(models.Model):

    class StatusChoices(models.TextChoices):
        PENDING = ("pending", 'Pending')
        ACCEPTED = ("accepted", 'Accepted')
        EXPIRED = ("expired", 'Expired')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    workspace = models.ForeignKey('workspace.Workspace', on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invitations')

    email = models.EmailField() #invited email
    token = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'invitations'

    def __str__(self):
        return f"{self.email} → {self.workspace} ({self.status})"