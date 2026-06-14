from rest_framework import serializers
from .models import Workspace, WorkspaceMember
from apps.subscription.serializers import WorkspaceSubscriptionSerializer


class CreateWorkspaceSerilaizer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Workspace
        fields = ["name", "slug", "owner"]


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


class WorkspaceUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = ["name", "slug"]

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "At least one field (name or slug) is required."
            )

        return attrs


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
