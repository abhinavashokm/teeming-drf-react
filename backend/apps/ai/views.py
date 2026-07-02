from rest_framework import status

from core.permission_views import MemberBaseView
from core.responses.api_response import success_response, error_response
from . import serializers, exceptions
from . import ai_services
from django.conf import settings
from .schemas.improve_idea import ImproveIdeaResponse
from core.constants.error_codes import ErrorCode


class ImproveIdeaView(MemberBaseView):

    throttle_scope = "ai"

    def post(self, request, **kwargs):

        serializer = serializers.ImproveIdeaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # mock ai fallback for testing
        if settings.USE_MOCK_AI:
            return success_response(
                data=ImproveIdeaResponse.mock_response().model_dump()
            )

        service = ai_services.ImproveIdeaService()

        try:
            result = service.improve_idea(**serializer.validated_data)
        except exceptions.AIProviderException:
            return error_response(
                details="AI service temporarily unavailable.",
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except exceptions.AIQuotaExceededException:

            return error_response(
                details="AI limit reached. Please try again in a minute.",
                error_code=ErrorCode.AI_RATE_LIMITED,
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            )

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
