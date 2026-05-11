from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer,
    LoginSerializer,
)
from core.services import otp_service, email_service
from core.redis import otp_storage
from .models import User


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # generate otp
        otp = otp_service.generate_otp()

        # store otp to redis
        otp_storage.save_otp(user.email, otp)

        # send otp to users mail
        email_service.send_verification_otp_email(email=user.email, otp=otp)

        return Response(
            {"message": "OTP sent successfully", "email": serializer.data.get("email")},
            status=status.HTTP_201_CREATED,
        )


class VerifyOTPView(APIView):

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # otp verification logic
        otp = serializer.validated_data["otp"]
        email = serializer.validated_data["email"]

        stored_otp = otp_storage.get_otp(email)

        if not stored_otp:
            return Response(
                {"message": "OTP expired or not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if stored_otp != otp:
            return Response(
                {"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        # user verified - update db
        User.objects.filter(email=email).update(is_verified=True)

        # delete otp record
        otp_storage.delete_otp(email)

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
                {"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_verified:
            return Response(
                {"message": "Account not verified"}, status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)


        response = Response(
            {
                "message": "Login successfull",
                "access_token": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )

        # Set refresh token as httpOnly cookie
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age= 7*24*60*60 #7days (in seconds)
        )

        return response
