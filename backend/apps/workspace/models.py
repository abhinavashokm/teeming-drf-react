import uuid

from django.db import models
from apps.users.models import User


class Workspace(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    owner_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_workspaces"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "workspaces"

    def __str__(self):
        return self.name
