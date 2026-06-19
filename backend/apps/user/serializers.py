from rest_framework import serializers

from .models import User
from core.constants.error_codes import ErrorCode
from apps.workspace.serializers import WorkspaceRetrieveSerializer


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'full_name', 'email')


class MeSerilaizer(serializers.ModelSerializer):
    last_workspace = WorkspaceRetrieveSerializer()

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', "last_workspace")
        

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["full_name", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "email": {"validators": []},
        }

    def validate_email(self, value):

        value = value.strip().lower()

        if User.objects.filter(email=value).exists():

            raise serializers.ValidationError(
                "Account already exists, Please log in",
                code=ErrorCode.ACCOUNT_ALREADY_EXISTS,
            )

        return value

    # manually call create user because modelserializer calls User.objects.create(),
    # which will not hash password
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CompleteSignupSerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class ResendOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        user_exists = User.objects.filter(email=value).exists()

        if user_exists:
            raise serializers.ValidationError(
                "Account already verified", code=ErrorCode.ACCOUNT_ALREADY_EXISTS
            )

        return value


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "full_name", "email"]


class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        user_exists = User.objects.filter(email=value).exists()

        if not user_exists:
            raise serializers.ValidationError(
                "No account found with this email.", code=ErrorCode.ACCOUNT_NOT_FOUND
            )

        return value


class ResetPasswordSerializer(serializers.Serializer):

    token = serializers.CharField()
    password = serializers.CharField()


class UpdateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['full_name']