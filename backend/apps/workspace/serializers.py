import re

from rest_framework import serializers
from .models import Workspace, WorkspaceMember
from apps.subscription.serializers import WorkspaceSubscriptionSerializer


class WorkspaceSlugValidationMixin:

    def validate_slug(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("Must be at least 3 characters.")

        if len(value) > 50:
            raise serializers.ValidationError("Cannot exceed 50 characters.")

        if not re.fullmatch(r"[a-z0-9-]+", value):
            raise serializers.ValidationError(
                "Use lowercase letters, numbers and hyphens only."
            )

        if value.startswith("-"):
            raise serializers.ValidationError("Cannot start with a hyphen.")

        if value.endswith("-"):
            raise serializers.ValidationError("Cannot end with a hyphen.")

        if "--" in value:
            raise serializers.ValidationError("Cannot contain consecutive hyphens.")

        queryset = Workspace.objects.filter(slug=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("This workspace URL is already taken.")

        return value


class CreateWorkspaceSerilaizer(
    WorkspaceSlugValidationMixin, serializers.ModelSerializer
):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Workspace
        fields = ["name", "slug", "owner"]


class WorkspaceUpdateSerializer(
    WorkspaceSlugValidationMixin, serializers.ModelSerializer
):

    class Meta:
        model = Workspace
        fields = ["name", "slug"]

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "At least one field (name or slug) is required."
            )

        return attrs


class WorkspaceRetrieveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = ["name", "slug", "id"]


class GetCurrentWorkspaceSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()
    limits = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = ["id", "name", "slug", "role", "subscription", "limits"]

    def get_role(self, obj):
        return self.context["member"].role

    def get_subscription(self, obj):
        subscription = self.context["subscription"]

        return WorkspaceSubscriptionSerializer(subscription).data

    def get_limits(self, obj):
        return self.context["limits"]


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.id")
    full_name = serializers.CharField(source="user.full_name")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = WorkspaceMember
        fields = ["id", "user_id", "full_name", "email", "role", "joined_at"]


class WorkspaceRoleUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkspaceMember
        fields = ["role"]
