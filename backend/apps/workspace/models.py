from django.db import models
from apps.user.models import User
from core.models import BaseAbstractModel, WorkspaceScopedBaseModel

class Workspace(BaseAbstractModel):

    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_workspaces"
    )
    logo_key = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = "workspaces"

    def __str__(self):
        return self.name


class WorkspaceMember(WorkspaceScopedBaseModel):

    class RoleChoices(models.TextChoices):
        ADMIN = "admin", "Admin"
        MEMBER = "member", "Member"
        OWNER = "owner", "Owner"

    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name="members"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="workspace_memberships"
    )

    role = models.CharField(
        max_length=15, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )

    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # remove inherited field (instead use joined_at)
    created_at = None

    class Meta:
        db_table = "workspace_members"
        unique_together = ("workspace", "user")

    def __str__(self):
        return f"{self.user} - {self.workspace} ({self.role})"






