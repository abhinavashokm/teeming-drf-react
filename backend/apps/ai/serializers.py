from rest_framework import serializers


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