from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from core.responses.api_response import (
    success_response,
    error_response,
)
from .serializers import (
    RegisterSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer,
    LoginSerializer,
    UserSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from django.conf import settings
from . import services


class RegisterView(APIView):

    def post(self, request):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        services.register_user(
            email=serializer.validated_data["email"],
            full_name=serializer.validated_data["full_name"],
            password=serializer.validated_data["password"],
        )

        return success_response(
            message="OTP sent successfully",
            data={"email": serializer.validated_data["email"]},
            status_code=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        services.verify_otp_and_create_user(
            email=serializer.validated_data["email"],
            otp=serializer.validated_data["otp"],
        )

        return success_response(
            message="verification successfull", status_code=status.HTTP_200_OK
        )


class ResendOTPView(APIView):

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        services.resend_otp(email=serializer.validated_data["email"])

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user, refresh_token = services.login_user(
            request=request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        response = success_response(
            message="Login successfull",
            data={
                "user": UserSerializer(user).data,
                "access_token": str(refresh_token.access_token),
            },
            status_code=status.HTTP_200_OK,
        )

        # Set refresh token as httpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh_token),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
        )

        return response


class ForgotPasswordView(APIView):

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # send password reset link to mail
        services.send_password_reset_link(email=serializer.validated_data["email"])

        return success_response(
            message="reset password link sent to mail", status_code=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        services.verify_token_and_update_password(
            reset_token=serializer.validated_data["token"],
            new_password=serializer.validated_data["password"],
        )

        return success_response(
            message="password reset successfull",
            status_code=status.HTTP_200_OK,
        )
