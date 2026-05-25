from .models import WorkspaceMember, Workspace


def fetch_user_workspace_list(user):
    memberships = WorkspaceMember.objects.filter(
        user=user,
        workspace__is_deleted=False,
    ).select_related("workspace")

    membership_res = [
        {
            "id": m.workspace.id,
            "name": m.workspace.name,
            "slug": m.workspace.slug,
            "role": m.role,
        }
        for m in memberships
    ]

    last_workspace = Workspace.objects.filter(id=user.last_workspace).filter()
    last_workspace_res = {}

    if last_workspace:
        last_workspace_res = {
            "id": last_workspace.id,
            "slug": last_workspace.slug,
        }

    return membership_res, last_workspace_res


def add_workspace_member(user, workspace):
    WorkspaceMember.objects.create(user=user, workspace=workspace)


def fetch_workspace_members(workspace):
    return WorkspaceMember.objects.filter(workspace=workspace)


def update_workspace(workspace, data):
    """Update workspace with provided fields."""

    for field, value in data.items():
        setattr(workspace, field, value)

    workspace.save()
    return workspace


def delete_workspace(workspace):
    """Delete workspace"""

    workspace.soft_delete()
