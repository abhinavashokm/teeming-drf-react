from rest_framework import status

from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode


class GoalNotFound(AppException):
    status_code=status.HTTP_404_NOT_FOUND
    error_code=ErrorCode.GOAL_NOT_FOUND
    message="Goal not found"
    