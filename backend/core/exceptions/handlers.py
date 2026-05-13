from rest_framework.views import exception_handler
from core.responses.api_response import error_response
from rest_framework.exceptions import ValidationError
from core.constants.error_codes import ErrorCode


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:

        if isinstance(exc, ValidationError):

            # Check if any field error has a custom code
            error_code = ErrorCode.VALIDATION_ERROR

            for field_errors in response.data.values():
                for error in field_errors:
                    if isinstance(error, dict) and 'code' in error.keys():
                        error_code = error['code']
                        break

            # Handle serializer validation errors separately
            if isinstance(exc, ValidationError):
                return error_response(
                    message="Validation failed",
                    details=response.data,   # {"email": ["This field is required."]}
                    status_code=response.status_code,
                    error_code=error_code
                )

        # All other DRF exceptions (401, 403, 404, throttle, etc.)
        return error_response(
            message=str(exc),
            status_code=response.status_code
        )
    
    return None


# structure of serializer validation error (result of response.data.values()) - for reference
# [
#     [{"message": "...", "code": "ACCOUNT_ALREADY_EXISTS"}],  # email errors
#     ["This field is required."],                              # password errors
#     [{"message": "...", "code": "USERNAME_TAKEN"}, ...]      # username errors
# ]