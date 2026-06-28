from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.responses.api_response import success_response
from .import serializers, staff_services


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserManagementView(AdminBaseView):

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        status = request.query_params.get('status', 'all').lower()

        users = staff_services.list_users(search=search, status=status)

        return success_response(
            data={
                "users": serializers.AdminUserListSerializer(users, many=True).data
            }
        )
    

class UserDetailView(AdminBaseView):

    def get(self, request, user_id):

        user = staff_services.get_user_detail(
            user_id=user_id
        )

        return success_response(
            data=serializers.AdminUserDetailSerializer(user).data
        )