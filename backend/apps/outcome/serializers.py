from rest_framework import serializers
from .models import OutcomeMetric, OutcomeCheckIn, CheckInMetricValue
from apps.user.serializers import UserBasicSerializer


class MetricWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = OutcomeMetric
        fields = ["name", "baseline_value", "target_value", "unit", "direction"]


class ReadMetricSerializer(serializers.ModelSerializer):

    class Meta:
        model = OutcomeMetric
        fields = ["id", "name", "baseline_value", "target_value", "unit", "direction"]


class CheckinMetricSerializer(serializers.ModelSerializer):
    metric_id = serializers.PrimaryKeyRelatedField(
        queryset=OutcomeMetric.objects.all(), source="metric"
    )
    name = serializers.CharField(source="metric.name", read_only=True)

    class Meta:
        model = CheckInMetricValue
        fields = ["metric_id", "name", "value"]


class WriteCheckinSerializer(serializers.ModelSerializer):
    metric_values = CheckinMetricSerializer(many=True, required=False)

    def update(self, instance, validated_data):
        metric_values_data = validated_data.pop("metric_values", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if metric_values_data is not None:
            for item in metric_values_data:
                CheckInMetricValue.objects.filter(
                    checkin=instance, metric=item["metric"]
                ).update(value=item["value"])

        return instance

    class Meta:
        model = OutcomeCheckIn
        fields = ["status", "notes", "metric_values"]


class ReadCheckinSerializer(serializers.ModelSerializer):
    metric_values = CheckinMetricSerializer(many=True, required=False)
    created_by = UserBasicSerializer()

    class Meta:
        model = OutcomeCheckIn
        fields = ["id", "status", "notes", "metric_values", "created_by", "created_at"]
