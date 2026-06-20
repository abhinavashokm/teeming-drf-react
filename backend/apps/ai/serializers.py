from rest_framework import serializers
from .models import AIAssistantResponse


class ImproveIdeaRequestSerializer(
    serializers.Serializer
):
    title = serializers.CharField(
        max_length=255
    )

    description = serializers.CharField(
        allow_blank=True,
        required=False,
    )

class AIAssistantRequestSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=AIAssistantResponse.ResponseType.choices
    )


class AIAssistantResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIAssistantResponse
        fields = ["id", "type", "content", "created_at" ]