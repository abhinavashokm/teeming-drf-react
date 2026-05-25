from django.db import models


class WorkspaceScopedManager(models.Manager):
    """manager for ensure multitenancy"""

    def in_workspace(self, workspace):
        return self.get_queryset().filter(workspace=workspace)


class WorkspaceScopedModel(models.Model):
    """Base model for all workspace-scoped resources."""

    workspace = models.ForeignKey(
        "workspace.Workspace",
        on_delete=models.CASCADE,
        related_name="%(class)ss",
    )

    objects = WorkspaceScopedManager()

    class Meta:
        abstract = True
