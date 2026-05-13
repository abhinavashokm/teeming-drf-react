from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from core.constants.error_codes import ErrorCode
from django.contrib.auth.hashers import make_password

from core.responses.api_response import (
    success_response,
    error_response,
    validation_error_response,
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
from .services import otp_service, signup_service, password_reset_service
from .models import User
from django.conf import settings


class RegisterView(APIView):

    def post(self, request):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return validation_error_response(serializer.errors)

        email = serializer.validated_data["email"]

        # generate otp
        otp = otp_service.generate_otp()

        # store signup data in redis
        signup_service.save_signup_data(
            email=email,
            full_name=serializer.validated_data["full_name"],
            password=make_password(
                serializer.validated_data["password"]
            ),  # hashed password
            otp=otp,
        )

        # send otp to users mail
        otp_service.send_verification_otp_email(email=email, otp=otp)

        return success_response(
            message="OTP sent successfully",
            data={"email": email},
            status_code=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # otp verification logic
        otp = serializer.validated_data["otp"]
        email = serializer.validated_data["email"]

        stored_signup_data = signup_service.get_signup_data(email)

        if not stored_signup_data:
            return error_response(
                message="OTP expired or not found",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if stored_signup_data.get("otp") != otp:
            return error_response(
                message="Invalid OTP", status_code=status.HTTP_400_BAD_REQUEST
            )


        email = stored_signup_data["email"]
        hashed_password = stored_signup_data["password"]
        full_name = stored_signup_data["full_name"]

        # create new user (password is already hashed. so use 'create' instead of 'create_user',
        # else it will double hash password)
        User.objects.create(
            email=User.objects.normalize_email(email),
            password=hashed_password,
            full_name=full_name,
        )

        # delete signup record
        signup_service.delete_signup_data(email)

        return success_response(
            message="verification successfull", status_code=status.HTTP_200_OK
        )


class ResendOTPView(APIView):

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        # generate otp
        otp = otp_service.generate_otp()

        # update otp in redis
        updated = signup_service.update_signup_otp(email=email, otp=otp)

        if not updated:
            return error_response(
                message="Your signup session has expired. Please sign up again to continue.",
                error_code=ErrorCode.SIGNUP_SESSION_EXPIRED,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # send otp to users mail
        otp_service.send_verification_otp_email(email=email, otp=otp)

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        print(email, password)

        user = authenticate(request, username=email, password=password)
        print(user)

        if not user:
            return error_response(
                error_code=ErrorCode.INVALID_CREDENTIALS,
                message="Invalid Credentials",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        response = success_response(
            message="Login successfull",
            data={
                "user": user_data,
                "access_token": str(refresh.access_token),
            },
            status_code=status.HTTP_200_OK,
        )

        # Set refresh token as httpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
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
        password_reset_service.send_password_reset_mail(
            serializer.validated_data["email"]
        )

        return success_response(
            message="reset password link sent to mail", status_code=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["password"]

        verified_user = password_reset_service.verify_reset_token(token)

        if not verified_user:
            return error_response(
                message="Unauthorized access", status_code=status.HTTP_401_UNAUTHORIZED
            )

        print(verified_user)
        user = User.objects.get(email=verified_user.get("email"))
        user.set_password(new_password)
        user.save()

        return success_response(
            message="password reset successfull",
            status_code=status.HTTP_200_OK,
        )
