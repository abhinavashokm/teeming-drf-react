from rest_framework import status

from core.exceptions.base import AppException


class FeatureNotAvailableException(AppException):

    status_code = status.HTTP_403_FORBIDDEN
    error_code = "feature_not_available"
    message = "This feature is not available on your current plan"

    def __init__(self, message=None):
        if message:
            self.message = message


class PlanLimitExceededException(AppException):

    status_code = status.HTTP_403_FORBIDDEN
    error_code = "plan_limit_exceeded"
    message = "You have reached the limit for your current plan"

    def __init__(self, message=None):
        if message:
            self.message = message