from .models import WorkspaceMember, Workspace
from django.db.models import Case, When, Value, IntegerField
from . import exceptions


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
            "role": m.get_role_display(),
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


def add_workspace_member(user, workspace, role):
    WorkspaceMember.objects.create(user=user, workspace=workspace, role=role)


def fetch_workspace_members_ordered(workspace):
    return (
        WorkspaceMember.objects
        .in_workspace(workspace)
        .annotate(
            role_priority=Case(
                When(role=WorkspaceMember.RoleChoices.OWNER, then=Value(0)),
                When(role=WorkspaceMember.RoleChoices.ADMIN, then=Value(1)),
                When(role=WorkspaceMember.RoleChoices.MEMBER, then=Value(2)),
                output_field=IntegerField(),
            )
        )
        .order_by("role_priority", "-joined_at")
    )



def update_workspace(workspace, data):
    """Update workspace with provided fields."""

    for field, value in data.items():
        setattr(workspace, field, value)

    workspace.save()
    return workspace


def delete_workspace(workspace):
    """Delete workspace"""

    workspace.soft_delete()


def update_role(workspace, member_id, role):
    """change workspace role of a member"""

    member = WorkspaceMember.objects.filter(workspace=workspace, id=member_id).first()

    if not member:
        raise exceptions.WorkspaceMemberNotFound()

    member.role = role
    member.save()

    return member


def remove_member(workspace, member_id):
    """remove a member from workspace"""

    member = WorkspaceMember.objects.filter(workspace=workspace, id=member_id).first()

    if not member:
        raise exceptions.WorkspaceMemberNotFound()
    
    member.delete()


def leave_workspace(user, workspace):
    """remove current user from workspace member"""

    member = WorkspaceMember.objects.filter(user=user, workspace=workspace).first()

    if not member:
        raise exceptions.WorkspaceMemberNotFound()
    
    member.delete()
