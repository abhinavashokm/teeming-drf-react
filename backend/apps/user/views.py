from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenBlacklistView
from rest_framework.permissions import AllowAny

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from core.responses.api_response import success_response, error_response
from .serializers import (
    RegisterSerializer,
    CompleteSignupSerializer,
    ResendOTPSerializer,
    LoginSerializer,
    UserSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from django.conf import settings
from . import exceptions, user_services, serializers
from .helpers import cookie_helper
from core.throttles import AuthThrottle, SensitiveThrottle
from apps.invitation.serializers import JoinedWorkspaceSerializer
from core.services import s3_service


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_services.register_user(
            email=serializer.validated_data["email"],
            full_name=serializer.validated_data["full_name"],
            password=serializer.validated_data["password"],
        )

        return success_response(
            message="OTP sent successfully",
            data={"email": serializer.validated_data["email"]},
            status_code=status.HTTP_200_OK,
        )


class CompleteSignupView(APIView):

    permission_classes = [AllowAny]
    throttle_classes = [SensitiveThrottle]

    def post(self, request):

        serializer = CompleteSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation_token = request.query_params.get("token")

        user, joined_workspace = user_services.verify_otp_and_complete_signup(
            email=serializer.validated_data["email"],
            otp=serializer.validated_data["otp"],
            invitation_token=invitation_token,
        )

        refresh_token = user_services.generate_tokens_for_user(user)

        response_data = {
            "user": UserSerializer(user).data,
            "access_token": str(refresh_token.access_token),
        }

        if joined_workspace:
            response_data["joined_workspace"] = JoinedWorkspaceSerializer(
                joined_workspace
            ).data

        response = success_response(
            message="Email verified successfully",
            data=response_data,
            status_code=status.HTTP_201_CREATED,
        )

        # Set httpOnly refresh cookie, same as login
        response = cookie_helper.set_refresh_cookie(
            refresh_token=refresh_token, response=response
        )

        return response


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_services.resend_otp(email=serializer.validated_data["email"])

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):

    permission_classes = [AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation_token = request.query_params.get("token")

        user, refresh_token, joined_workspace = user_services.login_user(
            request=request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            invitation_token=invitation_token,
        )

        response = None
        response_data = {
            "user": serializers.MeSerilaizer(user).data,
            "access_token": str(refresh_token.access_token),
        }

        if invitation_token:
            response_data["joined_workspace"] = JoinedWorkspaceSerializer(
                joined_workspace
            ).data

            response = success_response(
                message="Login successful. You have joined the workspace.",
                data=response_data,
                status_code=status.HTTP_201_CREATED,
            )

        response = success_response(
            message="Login successfull",
            data=response_data,
            status_code=status.HTTP_200_OK,
        )

        # Set refresh token as httpOnly cookie
        response = cookie_helper.set_refresh_cookie(
            refresh_token=refresh_token, response=response
        )

        return response


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise exceptions.InvalidRefreshToken()

        token = user_services.rotate_refresh_token(refresh_token)

        res = success_response(data={"access_token": token["access_token"]})
        res = cookie_helper.set_refresh_cookie(
            refresh_token=token["refresh_token"], response=res
        )
        return res


class MeView(APIView):
    """retrieve, update, delete authenticated user"""

    def get(self, request):
        """retrieve authenticated user"""

        return success_response(data=serializers.MeSerilaizer(request.user).data)

    def patch(self, request):
        """update authenticated user"""

        serializer = serializers.UpdateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_services.update_user(user=request.user, data=serializer.data)

        return success_response(
            message="Profile updated",
            data=serializer.data,
            status_code=status.HTTP_200_OK,
        )

    def delete(self, request):
        """delete authenticated user's account"""

        user_services.delete_user(user=request.user)

        return success_response(status_code=status.HTTP_204_NO_CONTENT)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # send password reset link to mail
        user_services.send_password_reset_link(email=serializer.validated_data["email"])

        return success_response(
            message="reset password link sent to mail", status_code=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [SensitiveThrottle]

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_services.verify_token_and_update_password(
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
            return error_response(
                message="No refresh token.", status_code=status.HTTP_400_BAD_REQUEST
            )

        # Inject into request data so parent handles blacklisting
        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        # Clear cookie
        response.delete_cookie("refresh_token")
        return response


class GoogleLoginView(SocialLoginView):
    permission_classes = [AllowAny]

    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.FRONTEND_URL
    client_class = OAuth2Client

    def get_response(self):
        response = super().get_response()

        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

        user = user_services.get_or_update_google_user(self.request.user)

        res = success_response(
            data={
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                },
            }
        )

        res = cookie_helper.set_refresh_cookie(
            refresh_token=refresh_token, response=res
        )

        return res


class ValidateResetTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            raise exceptions.InvalidPasswordResetToken()

        user_services.validate_reset_token(token)

        return success_response(
            message="password reset token verified", status_code=status.HTTP_200_OK
        )


class UserAvatarUploadURLView(APIView):

    def post(self, request, **kwargs):

        serializer = serializers.UserAvatarUploadURLSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        res_data = s3_service.generate_user_avatar_upload_url(
            user=request.user, content_type=serializer.validated_data["content_type"]
        )

        return success_response(data=res_data)


class SaveUserAvatarUrlView(APIView):

    def post(self, request, **kwargs):

        serializer = serializers.UserAvatarUrlSaveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_services.save_user_avatar_thumb_key(
            user=request.user,
            avatar_thumb_key=serializer.validated_data["avatar_thumb_key"],
            avatar_full_key=serializer.validated_data["avatar_full_key"],
        )

        return success_response()
