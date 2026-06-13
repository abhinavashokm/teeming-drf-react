from rest_framework import serializers
from .models import Plan, WorkspaceSubscription


class AdminWritePlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "code",
            "name",
            "description",
            "max_goals",
            "max_members",
            "can_use_ai_idea_suggestions",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "monthly_price",
        ]


class AdminReadPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name",
            "description",
            "max_goals",
            "max_members",
            "can_use_ai_idea_suggestions",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "monthly_price",
            "stripe_product_id",
            "stripe_price_id",
            "currency",
        ]


class UserReadPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name",
            "description",
            "max_goals",
            "max_members",
            "can_use_ai_idea_suggestions",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "monthly_price",
            "currency",
        ]


class CreateCheckoutSerializer(serializers.Serializer):
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=Plan.objects.filter(is_active=True),
        source="plan",
    )


class GetCurrentPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = ["id", "code", "name"]


class WorkspaceSubscriptionSerializer(serializers.ModelSerializer):
    plan = GetCurrentPlanSerializer()

    class Meta:
        model = WorkspaceSubscription
        fields = [
            "status",
            "expires_at",
            "plan",
        ]
