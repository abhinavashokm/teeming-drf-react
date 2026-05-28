from rest_framework import serializers
from apps.workspace.models import WorkspaceMember, Workspace
from .models import Invitation
from apps.user.models import User


class SendWorkspaceInvitationSerializer(serializers.Serializer):
    emails = serializers.ListField(
        child=serializers.EmailField(), 
        min_length=1,
        error_messages = {
            'min_length': "At least one email is required."
        }
                                   
                                   )
    role = serializers.ChoiceField(choices=WorkspaceMember.RoleChoices)

    def validate_emails(self, value):
        return list(set(email.strip().lower() for email in value))
    

class JoinedWorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['id', 'name', 'slug']


class InvitationInvitedBySerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "full_name", "email"]


class InvitationsReadSerializer(serializers.ModelSerializer):
    invited_by = InvitationInvitedBySerializer(read_only=True)

    class Meta:
        model = Invitation
        fields = ['id', 'invited_by', 'email', 'role', 'created_at', 'expires_at', 'status']
