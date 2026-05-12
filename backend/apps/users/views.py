from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from core.constants.error_codes import ErrorCode
from django.contrib.auth.hashers import make_password

from core.responses.api_response import success_response, error_response


from .serializers import (
    RegisterSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer,
    LoginSerializer,
    UserSerializer,
)
from .services import otp_service, signup_service
from .models import User


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():

            return error_response(
                message="Validation failed",
                details=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
                error_code="validation_error",
            )

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
                message= "OTP expired or not found",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if stored_signup_data.get("otp") != otp:
            return error_response(
                message="Invalid OTP", 
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # user verified - update db
        User.objects.create_user(
            email=stored_signup_data["email"],
            password=stored_signup_data["password"],
            full_name=stored_signup_data["full_name"],
        )

        # delete otp record
        signup_service.delete_signup_data(email)

        return Response(
            {"message": "verification successfull"}, status=status.HTTP_200_OK
        )


class ResendOTPView(APIView):

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        # generate otp
        otp = otp_service.generate_otp()

        # store otp to redis
        otp_storage.save_otp(email, otp)

        # send otp to users mail
        email_service.send_verification_otp_email(email=email, otp=otp)

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, email=email, password=password)

        if not user:
            return Response(
                {
                    "code": ErrorCode.AUTH_INVALID_CREDENTIALS,
                    "message": "Invalid Credentials",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_verified:
            return Response(
                {"message": "Account not verified"}, status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        response = Response(
            {
                "message": "Login successfull",
                "user": user_data,
                "access_token": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )

        # Set refresh token as httpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,  # 7days (in seconds)
        )

        return response
