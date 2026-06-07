from rest_framework import serializers
from .models import Goal


class GoalWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = ["name", "description", "status", "target_date"]


class GoalReadSerializer(serializers.ModelSerializer):
    is_starred = serializers.BooleanField(
        read_only=True
    )  # only for list goals (not in goal details)

    class Meta:
        model = Goal
        fields = ["id", "name", "description", "status", "target_date", "is_starred"]


class GoalBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Goal
        fields = ["id", "name"]
