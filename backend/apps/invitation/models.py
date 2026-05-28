import uuid

from django.db import models
from django.conf import settings
from core.models import WorkspaceScopedBaseModel
from apps.workspace.models import WorkspaceMember


# Create your models here.
class Invitation(WorkspaceScopedBaseModel):

    class StatusChoices(models.TextChoices):
        PENDING = ("pending", 'Pending')
        ACCEPTED = ("accepted", 'Accepted')
        EXPIRED = ("expired", 'Expired')
    
    workspace = models.ForeignKey('workspace.Workspace', on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_invitations')

    email = models.EmailField() #invited email
    role = models.CharField(choices=WorkspaceMember.RoleChoices, default=WorkspaceMember.RoleChoices.MEMBER)
    token = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    expires_at = models.DateTimeField()

    accepted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'invitations'

    def __str__(self):
        return f"{self.email} → {self.workspace} ({self.status})"