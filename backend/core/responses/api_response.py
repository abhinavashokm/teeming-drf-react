from rest_framework.response import Response
from rest_framework import status


def success_response(
    data=None, message="Success", status_code=status.HTTP_200_OK, meta=None
):
    """Standardized success response wrapper."""

    response_data = {
        "success": True,
    }

    if message:
        response_data["message"] = message

    if data is not None:
        response_data["data"] = data

    if meta:
        response_data["meta"] = meta

    return Response(response_data, status=status_code)


# def error_response(
#     error_code="error",
#     message="Something went wrong",
#     details=None,
#     status_code=status.HTTP_400_BAD_REQUEST,
# ):
#     """Standardized error response wrapper."""

#     return Response(
#         {
#             "success": False,
#             "error": {
#                 "code": error_code,
#                 "message": message,
#                 "details": details or {},
#             },
#         },
#         status=status_code,
#     )


def error_response(message="Something went wrong", details=None, status_code=status.HTTP_400_BAD_REQUEST, error_code=None):
    """
    Standardized error response wrapper.
    
    Args:
        message: Human-readable error message
        details: Optional detailed errors (validation errors, etc.)
        status_code: HTTP status code (default 400)
        error_code: Optional machine-readable error code
    
    Returns:
        Response object with standardized error structure
    """


    response_data = {
        'success': False,
        'error': {
            'message': message,
        }
    }
    
    if error_code:
        response_data['error']['code'] = error_code
    
    if details:
        response_data['error']['details'] = details
    
    return Response(response_data, status=status_code)