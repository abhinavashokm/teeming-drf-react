from rest_framework import status


class AppException(Exception):
    message = "Something went wrong"
    error_code = None
    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, message=None, error_code=None):

        if message:
            self.message = message

        if error_code:
            self.error_code = error_code


class NotFoundException(AppException):

    def __init__(self, errorMsg):
        self.message = errorMsg or "Not found"

    status_code = status.HTTP_404_NOT_FOUND
    message = "Not found"



