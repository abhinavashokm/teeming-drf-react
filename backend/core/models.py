import uuid
from django.db import models
from django.utils import timezone


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class WorkspaceScopedManager(SoftDeleteManager):
    """Manager to enforce multitenancy."""

    def in_workspace(self, workspace):
        return self.get_queryset().filter(workspace=workspace)


class UUIDAbstractModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampAbstractModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class SoftDeleteAbstractModel(models.Model):
    """Abstract model that provides soft delete functionality."""

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def soft_delete(self):
        """Mark as deleted without removing from DB."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        """Restore a soft deleted instance."""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

    class Meta:
        abstract = True


class BaseAbstractModel(
    UUIDAbstractModel, SoftDeleteAbstractModel, TimeStampAbstractModel
):
    """Base abstract model with UUID, soft delete, and timestamp support."""

    class Meta:
        abstract = True


class WorkspaceScopedBaseModel(BaseAbstractModel):
    """Base model for all workspace-scoped resources."""

    workspace = models.ForeignKey(
        "workspace.Workspace",
        on_delete=models.CASCADE,
        related_name="%(class)ss",
    )
    objects = WorkspaceScopedManager()
    all_objects = models.Manager()  # access deleted records when needed

    class Meta:
        abstract = True
