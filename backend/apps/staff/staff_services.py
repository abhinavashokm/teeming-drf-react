from apps.user.models import User
from django.db.models import Count, Q
from apps.user.helpers.user_helper import get_user_or_raise
from core.services import s3_service


def list_users(search=None, status=None):
    queryset = User.objects.annotate(
        workspace_count=Count(
            "workspace_memberships",
            filter=Q(
                workspace_memberships__is_deleted=False,
                workspace_memberships__workspace__is_deleted=False,
            ),
            distinct=True,
        )
    ).order_by("-created_at")

    if search:
        queryset = queryset.filter(
            Q(full_name__icontains=search) | Q(email__icontains=search)
        )

    if status and status != "all":
        if status == "active":
            queryset = queryset.filter(is_active=True)
        elif status == "suspended":
            queryset = queryset.filter(is_active=False)

    return queryset


def get_user_detail(user_id):
    get_user_or_raise(user_id=user_id)

    return User.objects.annotate(
        workspace_count=Count(
            "workspace_memberships",
            filter=Q(
                workspace_memberships__is_deleted=False,
                workspace_memberships__workspace__is_deleted=False,
            ),
            distinct=True,
        )
    ).get(id=user_id)
