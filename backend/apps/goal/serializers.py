from django.utils import timezone

from rest_framework import serializers
from .models import Goal


class GoalWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = ["name", "description", "status", "target_date"]

    def validate_target_date(self, value):
        if value and value < timezone.localdate():
            raise serializers.ValidationError("Target date must be today or a future date.")
        return value

class GoalReadSerializer(serializers.ModelSerializer):
    is_starred = serializers.BooleanField(
        read_only=True
    )  # only for list goals (not in goal details)
    ideas_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Goal
        fields = ["id", "name", "description", "status", "target_date", "is_starred", "ideas_count"]


class GoalBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = ["id", "name"]
