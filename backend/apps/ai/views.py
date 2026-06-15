from rest_framework import status

from core.permission_views import MemberBaseView
from core.responses.api_response import success_response, error_response
from . import serializers, exceptions
from .services import ai_service
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
                data=ImproveIdeaResponse(
                    improved_title="This is mock data",
                    improved_description="This is also mock data...",
                    suggestions=[],
                ).model_dump()
            )

        service = ai_service.AIService()

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
