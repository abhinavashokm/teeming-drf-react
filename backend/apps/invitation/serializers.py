from rest_framework import serializers


class SendWorkspaceInvitationSerializer(serializers.Serializer):
    emails = serializers.ListField()

