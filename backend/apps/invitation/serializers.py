from rest_framework import serializers
from apps.workspace.models import WorkspaceMember


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
