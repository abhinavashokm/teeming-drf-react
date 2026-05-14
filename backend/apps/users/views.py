from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenBlacklistView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.models import SocialAccount

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
from . import services, exceptions


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
            secure=False if settings.DEBUG else True,
            samesite="Lax",
            max_age=settings.REFRESH_TOKEN_MAX_AGE,
        )

        return response


class RefreshTokenView(APIView):

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise exceptions.InvalidCredentials()

        token = RefreshToken(refresh_token)

        return success_response(data={"access_token": str(token.access_token)})


class MeView(APIView):

    def get(self, request):
        user = request.user

        return success_response(
            data={
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                }
            }
        )


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


class CookieTokenBlacklistView(TokenBlacklistView):

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "No refresh token."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Inject into request data so parent handles blacklisting
        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        # Clear cookie
        response.delete_cookie("refresh_token")
        return response


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.FRONTEND_URL
    client_class = OAuth2Client

    def get_response(self):
        response = super().get_response()

        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

        user = self.request.user


        # get google profile name to full_name
        try:
            social_account = SocialAccount.objects.get(user=user, provider='google')
            extra_data = social_account.extra_data  # dict from Google
            full_name = extra_data.get('name', '')  # Google sends 'name' field
        except SocialAccount.DoesNotExist:
            full_name = user.full_name  # fallback


        res = success_response(
            data={
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": full_name,  # adjust to your User model fields
                },
            }
        )

        res.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # True in production
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,  # 7 days
        )

        return res
