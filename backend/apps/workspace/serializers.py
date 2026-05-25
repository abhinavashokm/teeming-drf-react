from rest_framework import serializers
from .models import Workspace, WorkspaceMember


class CreateWorkspaceSerilaizer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Workspace
        fields = ["name", "slug", "owner"]


class WorkspaceRetrieveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = ["name", "slug", "id"]


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.id')
    full_name = serializers.CharField(source='user.full_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = WorkspaceMember
        fields = ['id', 'user_id', 'full_name', 'email', 'role', 'joined_at']