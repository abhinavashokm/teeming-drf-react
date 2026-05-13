from rest_framework.response import Response
from rest_framework import status

from core.constants.error_codes import ErrorCode


def success_response(
    data=None, message="Success", status_code=status.HTTP_200_OK, meta=None
):
    """
    Standardized success response wrapper.

    Structure:
        {
            "success": True,
            "message": Human-readable error message,
            "data"   : The main response data (dict, list, or None)
            "meta": Optional metadata dictionary,
        }
    """

    response_data = {"success": True, "data": data}

    if message:
        response_data["message"] = message

    if meta:
        response_data["meta"] = meta

    return Response(response_data, status=status_code)


def error_response(
    message="Something went wrong",
    details=None,
    status_code=status.HTTP_400_BAD_REQUEST,
    error_code=None,
):
    """
    Standardized error response wrapper.

    Structure:
        {
            "success": False,
            "error": {
                "code": optional machine-readable error code,
                "message": Human-readable error message,
                "details": Optional detailed errors (validation errors, etc.),
            },
        }

    """

    response_data = {
        "success": False,
        "error": {
            "message": message,
        },
    }

    if error_code:
        response_data["error"]["code"] = error_code

    if details:
        response_data["error"]["details"] = details

    return Response(response_data, status=status_code)


def validation_error_response(serializer_errors):
    return error_response(
        message="Validation failed",
        details=serializer_errors,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code=ErrorCode.VALIDATION_ERROR,
    )
