from rest_framework import serializers
from .models import DiscussionMessage
from apps.user.serializers import UserBasicSerializer


class ReadDiscussionMessageSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer()

    class Meta:
        model = DiscussionMessage
        fields = ["id", "sender", "content", "created_at"]