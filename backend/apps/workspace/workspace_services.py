from .models import WorkspaceMember, Workspace
from django.db import transaction
from django.db.models import Case, When, Value, IntegerField, Q, Count, Prefetch
from . import exceptions
from apps.subscription.services import subscription_services
from apps.subscription.models import WorkspaceSubscription


@transaction.atomic
def create_workspace_with_free_plan(current_user, data):
    """
    create workspace with free plan, add current user as owner of the workspace
    """
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


def list_workspaces(search: str = "", status: str = "all", plan: str = "all"):
    current_subscription_qs = (
        WorkspaceSubscription.objects.select_related("plan")
        .filter(
            Q(status=WorkspaceSubscription.StatusChoices.ACTIVE)
            | Q(status=WorkspaceSubscription.StatusChoices.TRIALING),
            is_deleted=False,
        )
        .order_by("-started_at")
    )

    qs = (
        Workspace.objects.filter(is_deleted=False)
        .select_related("owner")
        .prefetch_related(
            Prefetch(
                "subscriptions",
                queryset=current_subscription_qs,
                to_attr="_current_subscriptions",
            )
        )
        .annotate(
            member_count=Count(
                "members",
                filter=Q(members__is_deleted=False),
                distinct=True,
            ),
            goal_count=Count(
                "goals",
                filter=Q(goals__is_deleted=False),
                distinct=True,
            ),
        )
        .order_by("-created_at")
    )

    if search:
        qs = qs.filter(
            Q(name__icontains=search)
            | Q(slug__icontains=search)
            | Q(owner__email__icontains=search)
            | Q(owner__full_name__icontains=search)
        )

    if status == "suspended":
        return []

    if plan != "all":
        qs = qs.filter(
            Q(subscriptions__status=WorkspaceSubscription.StatusChoices.ACTIVE)
            | Q(subscriptions__status=WorkspaceSubscription.StatusChoices.TRIALING),
            subscriptions__plan__code__iexact=plan,
            subscriptions__is_deleted=False,
        ).distinct()

    workspaces = list(qs)

    for workspace in workspaces:
        workspace.active_subscription = (
            workspace._current_subscriptions[0]
            if workspace._current_subscriptions
            else None
        )
        workspace.is_suspended = False

    return workspaces


def get_workspace_members_count(workspace):
    
    return WorkspaceMember.objects.in_workspace(workspace).count()