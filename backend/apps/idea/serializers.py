from rest_framework import serializers

from .models import Idea
from apps.user.serializers import UserBasicSerializer


class CreateIdeaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Idea
        fields = 'title', 'description', 
        extra_kwargs={
            'description': {'required': False},
        }


class IdeaReadSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)

    class Meta:
        model = Idea
        fields = 'id', 'title', 'description', 'deadline', 'created_by', 'status', 'created_at'
