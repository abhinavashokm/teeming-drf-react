from .models import WorkspaceMember, Workspace
from django.db import transaction
from django.db.models import Case, When, Value, IntegerField
from . import exceptions
from apps.subscription import subscription_services
from .helpers.workspace_helper import get_workspace_or_raise


def create_workspace_with_free_plan(current_user, data):
    """
    create workspace with free plan, add current user as owner of the workspace
    """

    with transaction.atomic():

        workspace = Workspace.objects.create(**data)

        #add current user a membership to workspace as role owner
        WorkspaceMember.objects.create(
            user=current_user,
            workspace=workspace,
            role=WorkspaceMember.RoleChoices.OWNER,
        )

        #create free plan subscription
        subscription_services.create_free_plan_subscription(workspace=workspace)

        return workspace


def fetch_user_workspace_list(user):
    memberships = WorkspaceMember.objects.filter(
        user=user,
        workspace__is_deleted=False,
    ).select_related("workspace")

    return [
        m.workspace
        for m in memberships
    ]


def add_workspace_member(user, workspace, role):
    WorkspaceMember.objects.create(user=user, workspace=workspace, role=role)


def fetch_workspace_members_ordered(workspace):
    return (
        WorkspaceMember.objects.in_workspace(workspace)
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


def save_workspace_logo_url(workspace, logo_key):

    workspace.logo_key = logo_key
    workspace.save()
