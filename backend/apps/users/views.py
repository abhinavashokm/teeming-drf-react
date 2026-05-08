from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer, VerifyOTPSerializer, ResendOTPSerializer
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
        email_service.send_otp(email=user.email, otp=otp)

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
        email_service.send_otp(email=email, otp=otp)

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_201_CREATED,
        )
