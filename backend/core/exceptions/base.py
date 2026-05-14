from rest_framework import status

class AppException(Exception):
    message = "Something went wrong"
    error_code = None
    status_code = status.HTTP_400_BAD_REQUEST