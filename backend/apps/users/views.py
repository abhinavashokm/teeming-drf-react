from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer
from core.services.email_service import EmailService


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        #serializer.save()

        #generate and send otp to users mail
        EmailService.create_and_send_otp(email=serializer.data.get('email'))

        return Response({"message": "OTP sent successfully", "email": serializer.data.get('email')}, status=status.HTTP_201_CREATED)
    

class VerifyOTPView(APIView):

    def post(self, request):
        print(request.data)

        #otp verification logic here

        return Response({"message": "verification successfull"}, status=status.HTTP_200_OK)
    

class ResendOTPView(APIView):

    def post(self, request):
        print(request.data)

        #otp resend logic here

        return Response({"message": "OTP resent successfull"}, status=status.HTTP_200_OK)