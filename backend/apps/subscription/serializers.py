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
            "is_archived",
            "version",
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
        queryset=Plan.objects.filter(is_archived=False),
        source="plan",
    )


class GetPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name",
            "monthly_price",
            "currency",
            "tier",
        ]


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


class AdminPlanEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = ["name", "description"]


class AdminPlanNewVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "name",
            "description",
            "monthly_price",
            "max_members",
            "max_goals",
            "can_use_ai_idea_suggestions",
            "can_use_ai_assistant",
            "can_export_workspace_data",
        ]

    #at least one of these structural fields must be different to create a new version
    STRUCTURAL_FIELDS = [
        "monthly_price",
        "max_members",
        "max_goals",
        "can_use_ai_idea_suggestions",
        "can_use_ai_assistant",
        "can_export_workspace_data",
    ]

    def validate(self, attrs):
        plan = self.context.get("plan")
        if plan:
            changed = any(
                attrs.get(field) != getattr(plan, field)
                for field in self.STRUCTURAL_FIELDS
                if field in attrs
            )
            if not changed:
                raise serializers.ValidationError(
                    "New version must change at least one structural field "
                    "(price, limits, or features). "
                    "To update name or description, use the Edit endpoint instead."
                )
        return attrs

    def validate_monthly_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_max_members(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Max members must be at least 1.")
        return value

    def validate_max_goals(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Max goals must be at least 1.")
        return value
