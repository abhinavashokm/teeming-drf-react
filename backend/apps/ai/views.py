from rest_framework import status

from core.permission_views import MemberBaseView
from core.responses.api_response import success_response
from . import serializers
from . import ai_services


class ImproveIdeaView(MemberBaseView):

    throttle_scope = "ai"

    def post(self, request, **kwargs):

        serializer = serializers.ImproveIdeaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = ai_services.ImproveIdeaService(workspace=request.workspace)
        result = service.improve_idea(**serializer.validated_data)

        return success_response(
            data=result.model_dump(),
        )


class AIAssistantView(MemberBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.AIAssistantRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assistant = ai_services.GoalAssistantService(
            current_user=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
        )

        ai_response = assistant.execute(
            action=serializer.validated_data["type"],
            message=serializer.validated_data.get("message", None),
        )

        return success_response(
            data=serializers.AIAssistantResponseSerializer(ai_response).data,
            status_code=status.HTTP_201_CREATED,
        )

    def get(self, request, **kwargs):

        ai_responses = ai_services.list_ai_assistant_responses(
            current_user=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
        )

        return success_response(
            data=serializers.AIAssistantResponseSerializer(ai_responses, many=True).data
        )

    def delete(self, request, **kwargs):

        ai_services.clear_all_assistant_responses(
            current_user=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
        )

        return success_response()
