from core.exceptions.base import AppException

class AIException(Exception):
    pass


class AIProviderException(AIException):
    pass


class AIRateLimitException(AIException):
    pass

class AIQuotaExceededException(AIException):
    pass