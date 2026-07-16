from rest_framework import status
from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode


class AIException(AppException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    error_code = ErrorCode.AI_UNAVILABLE
    message = "AI service temporarily unavailable."


class AIProviderException(AIException):
    pass

class AIQuotaExceededException(AIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    message = "AI limit reached. Please try again in a minute."