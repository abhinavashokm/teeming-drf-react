from core.permission_views import AdminBaseView, WorkspacePermissionBaseView
from core.permissions import IsWorkspaceAdmin, IsWorkspaceMember
from core.responses.api_response import success_response
from rest_framework import status
from . import serializers, outcome_services
from .helpers.outcome_helper import get_metric_or_raise, get_checkin_or_raise


class MetricListCreateView(WorkspacePermissionBaseView):

    permission_map = {
        "GET": [IsWorkspaceMember],
        "POST":[IsWorkspaceAdmin],
    }

    def post(self, request, **kwargs):
        """create one or more metrics under goal"""

        serializer = serializers.MetricWriteSerializer(
            data=request.data["metrics"], many=True
        )
        serializer.is_valid(raise_exception=True)

        created_metrics = outcome_services.create_metrics(
            current_user=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
            data=serializer.validated_data,
        )

        return success_response(
            message="Outcome metrics added",
            status_code=status.HTTP_201_CREATED,
            data=serializers.ReadMetricSerializer(created_metrics, many=True).data,
        )

    def get(self, request, **kwargs):

        metrics = outcome_services.list_goal_metrics(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(
            data={
                "metrics": serializers.ReadMetricSerializer(metrics, many=True).data,
            }
        )


class MetricDetailView(WorkspacePermissionBaseView):

    permission_map = {
        "GET": [IsWorkspaceMember],
        "PATCH": [IsWorkspaceAdmin],
        "DELETE": [IsWorkspaceAdmin],
    }

    def get(self, request, **kwargs):

        metric = outcome_services.get_metric(
            workspace=request.workspace, metric_id=kwargs["metric_id"]
        )

        return success_response(data=serializers.ReadMetricSerializer(metric).data)

    def patch(self, request, **kwargs):

        metric = get_metric_or_raise(
            workspace=request.workspace, metric_id=kwargs["metric_id"]
        )

        serializer = serializers.MetricWriteSerializer(
            instance=metric, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        updated_metric = serializer.save()

        return success_response(
            message="Metric updated",
            data=serializers.ReadMetricSerializer(updated_metric).data,
        )

    def delete(self, request, **kwargs):

        outcome_services.delete_metric(
            workspace=request.workspace, metric_id=kwargs["metric_id"]
        )

        return success_response(message="Metric deleted")


class CheckinListCreateView(WorkspacePermissionBaseView):

    permission_map = {
        "GET": [IsWorkspaceMember],
        "POST": [IsWorkspaceAdmin]
    }

    def post(self, request, **kwargs):

        serializer = serializers.WriteCheckinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        checkin = outcome_services.create_checkin(
            current_user=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
            data=serializer.validated_data,
        )

        return success_response(
            status_code=status.HTTP_201_CREATED,
            message="Checkin added",
            data=serializers.ReadCheckinSerializer(checkin).data,
        )

    def get(self, request, **kwargs):

        checkins = outcome_services.list_goal_checkins(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(
            data={
                "checkins": serializers.ReadCheckinSerializer(checkins, many=True).data
            }
        )


class CheckinDetailView(AdminBaseView):

    def get(self, request, **kwargs):

        checkin = outcome_services.get_checkin(
            workspace=request.workspace, checkin_id=kwargs["checkin_id"]
        )

        return success_response(data=serializers.ReadCheckinSerializer(checkin).data)
    
    def patch(self, request, **kwargs):

        checkin = get_checkin_or_raise(
            workspace=request.workspace,
            checkin_id=kwargs["checkin_id"]
        )

        serializer = serializers.WriteCheckinSerializer(instance=checkin, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated_checkin = serializer.save()

        return success_response(
            message="Metric updated",
            data=serializers.ReadCheckinSerializer(updated_checkin).data
        )

    def delete(self, request, **kwargs):

        outcome_services.delete_checkin(
            workspace=request.workspace, checkin_id=kwargs["checkin_id"]
        )

        return success_response(message="Checkin deleted")
