from rest_framework import status

from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode


class InvalidInviteToken(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = ErrorCode.INVALID_INVITATION
    message = "This invitation is invalid or has expired."


class InvitationAlreadyAccepted(AppException):
    status_code = status.HTTP_409_CONFLICT
    error_code = ErrorCode.INVITATION_ALREADY_ACCEPTED
    message = "This invitation has already been used."


class InvitationEmailMismatch(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = ErrorCode.INVITATION_EMAIL_MISMATCH
    message = "Please sign in with the invited account to accept this invitation."

    