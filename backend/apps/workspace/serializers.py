from rest_framework import serializers
from .models import Workspace


class CreateWorkspaceSerilaizer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Workspace
        fields = ["name", "slug", "owner"]


class WorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = ["name", "slug", "id"]


class SendWorkspaceInvitationSerializer(serializers.Serializer):
    emails = serializers.ListField()

