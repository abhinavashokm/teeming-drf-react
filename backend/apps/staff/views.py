from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.responses.api_response import success_response
from .import serializers, staff_services


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserManagementView(AdminBaseView):

    def get(self, request):

        users = staff_services.list_users()

        return success_response(
            data={
                "users":serializers.AdminUserListSerializer(users, many=True).data
                }
        )