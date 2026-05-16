from rest_framework import status

from core.exceptions.base import AppException
from core.constants.error_codes import ErrorCode


class InvalidRefreshToken(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = ErrorCode.REFRESH_TOKEN_INVALID
    message = "Session expired. Please login again."


class SignupSessionExpired(AppException):
    message = "Signup session expired. Please sign up again."
    error_code = ErrorCode.SIGNUP_SESSION_EXPIRED


class OTPExpired(AppException):
    message = "OTP expired, please resend to continue!"
    error_code = ErrorCode.OTP_EXPIRED


class InvalidOTP(AppException):
    message = "Invalid OTP. Please try again."
    error_code = ErrorCode.OTP_INVALID


class InvalidCredentials(AppException):
    error_code = ErrorCode.INVALID_CREDENTIALS
    message = "Invalid Credentials"
    status_code = status.HTTP_400_BAD_REQUEST


class InvalidPasswordResetToken(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = ErrorCode.PASSWORD_RESET_TOKEN_INVALID
    message = "Password reset link is invalid or expired. Please request a new one."


class SamePasswordException(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    message = "New password cannot be the same as your current password."
    error_code = ErrorCode.SAME_AS_PREVIOUS_PASSWORD



