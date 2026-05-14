from rest_framework import status

from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode



class SignupSessionExpired(AppException):
    message = "Signup session expired. Please sign up again."
    error_code = ErrorCode.SIGNUP_SESSION_EXPIRED


class OTPExpired(AppException):
    message = "OTP expired, please resend to continue!"


class InvalidOTP(AppException):
    message = "Invalid OTP"


class InvalidCredentials(AppException):
    error_code=ErrorCode.INVALID_CREDENTIALS
    message="Invalid Credentials"
    status_code=status.HTTP_401_UNAUTHORIZED


class PasswordResetSessionExpired(AppException):
    message = "Password reset link invalid or has expired. Please request a new one."
    status_code = status.HTTP_401_UNAUTHORIZED