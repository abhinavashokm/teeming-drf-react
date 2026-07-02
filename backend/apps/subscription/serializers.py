from rest_framework import serializers
from .models import Plan, WorkspaceSubscription, SubscriptionTransaction


class AdminWritePlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "code",
            "name",
            "description",
            "max_goals",
            "max_members",
            "can_use_ai_enhancements",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "monthly_price",
            "tier",
        ]


class AdminPlanListSerializer(serializers.ModelSerializer):
    subscriber_count = serializers.IntegerField(read_only=True)

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
            "can_use_ai_enhancements",
            "can_use_ai_assistant",
            "can_export_workspace_data",
            "is_archived",
            "archived_at",
            "version",
            "subscriber_count",
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
                "key": "AI_ENHANCEMENTS",
                "name": "AI Enhancements",
                "enabled": obj.can_use_ai_enhancements,
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


class AdminFreePlanUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "name",
            "description",
            "max_members",
            "max_goals",
            "can_use_ai_enhancements",
            "can_use_ai_assistant",
            "can_export_workspace_data",
        ]
    
    def validate_max_members(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Max members must be at least 1.")
        return value

    def validate_max_goals(self, value):
        if value is not None and value < 1:
            raise serializers.ValidationError("Max goals must be at least 1.")
        return value


class AdminPlanNewVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plan
        fields = [
            "name",
            "description",
            "monthly_price",
            "max_members",
            "max_goals",
            "can_use_ai_enhancements",
            "can_use_ai_assistant",
            "can_export_workspace_data",
        ]

    #at least one of these structural fields must be different to create a new version
    STRUCTURAL_FIELDS = [
        "monthly_price",
        "max_members",
        "max_goals",
        "can_use_ai_enhancements",
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



class TransactionWorkspaceSerializer(serializers.Serializer):
    name = serializers.CharField()
    owner_email = serializers.SerializerMethodField()

    def get_owner_email(self, obj):
        owner = getattr(obj, "owner", None)
        if not owner:
            return "-"
        return owner.email

class AdminTransactionListSerializer(serializers.ModelSerializer):
    workspace = TransactionWorkspaceSerializer()
    plan = GetPlanSerializer()
    date = serializers.DateTimeField(source="created_at", format="%b %d, %Y")

    class Meta:
        model = SubscriptionTransaction
        fields = [
            "id",
            "workspace",
            "plan",
            "amount",
            "currency",
            "type",
            "date",
            "gateway_invoice_id",
            "invoice_url",
        ]


class BillingOverviewCardsSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    active_subscriptions = serializers.IntegerField()
    total_workspaces = serializers.IntegerField()
    total_members = serializers.IntegerField()


class PlanDistributionSerializer(serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()


class TopPayingWorkspaceSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    plan = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class BillingOverviewSerializer(serializers.Serializer):
    overview = BillingOverviewCardsSerializer()
    plan_distribution = PlanDistributionSerializer(many=True)
    top_paying_workspaces = TopPayingWorkspaceSerializer(many=True)


class UpgradePlanSerializer(serializers.Serializer):
 
    plan_id = serializers.UUIDField()
 
    def validate_plan_id(self, value):
        if not Plan.objects.filter(id=value, is_archived=False).exists():
            raise serializers.ValidationError("Invalid or archived plan.")
        return value
 
    def validate(self, attrs):
        plan = Plan.objects.get(id=attrs["plan_id"], is_archived=False)
        attrs["plan"] = plan
        return attrs
