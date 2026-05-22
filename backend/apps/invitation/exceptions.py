from rest_framework import status

from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode


class InvalidInviteToken(AppException):
    status_code=status.HTTP_404_NOT_FOUND
    error_code=ErrorCode.INVALID_INVITATION
    message="This invitation is invalid or has expired."
    