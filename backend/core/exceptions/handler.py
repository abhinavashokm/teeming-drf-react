from rest_framework.views import exception_handler
from core.responses.api_response import error_response
from rest_framework.exceptions import ValidationError
from core.constants.error_codes import ErrorCode
from core.exceptions.base import AppException
from rest_framework.exceptions import Throttled
from rest_framework import status


def custom_exception_handler(exc, context):

    if isinstance(exc, Throttled):
        return error_response(
            message="Too many requests. Please try again later.",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code=ErrorCode.RATE_LIMITED,
        )
    
    elif isinstance(exc, AppException):
        return error_response(
            message=exc.message,
            error_code=exc.error_code,
            status_code=exc.status_code,
        )
    
    response = exception_handler(exc, context)

    if response is not None:

        # Handle serializer validation errors separately
        if isinstance(exc, ValidationError):
            return error_response(
                message="Validation failed",
                details=response.data,  # {"email": ["This field is required."]}
                status_code=response.status_code,
                error_code=ErrorCode.VALIDATION_ERROR,
            )

        # All other DRF exceptions (401, 403, 404, etc.)
        return error_response(message=str(exc), status_code=response.status_code)

    return None


