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
            "tier",
        ]


class AdminPlanListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name",
            "description",
            "tier",
            "monthly_price",
            "currency",
            "max_goals",
            "max_members",
            "can_use_ai_idea_suggestions",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "is_active",
        ]



class UserReadPlanSerializer(serializers.ModelSerializer):
    features = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name",
            "description",
            "max_goals",
            "max_members",
            "features",
            "monthly_price",
            "currency",
            "tier",
        ]

    def get_features(self, obj):
        return [
            {
                "key": "ai_idea_suggestions",
                "name": "AI Enhancements",
                "enabled": obj.can_use_ai_idea_suggestions,
            },
            {
                "key": "ai_assistant",
                "name": "AI Assistant",
                "enabled": obj.can_use_ai_assistant,
            },
            {
                "key": "export_workspace_data",
                "name": "Export Workspace Data",
                "enabled": obj.can_export_workspace_data,
            },
        ]


class CreateCheckoutSerializer(serializers.Serializer):
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=Plan.objects.filter(is_active=True),
        source="plan",
    )


class GetPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = ["id", "code", "name", "monthly_price", "currency", "tier",]


class WorkspaceSubscriptionSerializer(serializers.ModelSerializer):
    plan = GetPlanSerializer()
    scheduled_plan = GetPlanSerializer()

    class Meta:
        model = WorkspaceSubscription
        fields = [
            "status",
            "expires_at",
            "plan",
            "cancel_at_period_end",
            "scheduled_plan",
        ]
