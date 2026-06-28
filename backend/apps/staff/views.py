from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status

from core.responses.api_response import success_response
from .import serializers, staff_services
from apps.workspace import workspace_services
from apps.subscription import subscription_services
from apps.subscription import serializers as subscription_serializer



class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminUserListView(AdminBaseView):

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
    

class AdminWorkspaceListView(AdminBaseView):

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        status = request.query_params.get('status', 'all').lower()
        plan = request.query_params.get('plan', 'all').lower()

        workspaces = workspace_services.list_workspaces(
            search=search,
            status=status,
            plan=plan,
        )

        return success_response(
            data={
                "workspaces": serializers.AdminWorkspaceListSerializer(workspaces, many=True).data
            }
        )
    

class AdminPlanListView(AdminBaseView):

    def get(self, request):
        plans = subscription_services.list_plans()

        return success_response(
            data={
                "plans": subscription_serializer.AdminPlanListSerializer(plans, many=True).data
            }
        )
    
    def post(self, request):

        print(request.data)
        serializer = subscription_serializer.AdminWritePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_plan = subscription_services.create_plan(serializer.validated_data)

        return success_response(
            message="Plan created",
            data=subscription_serializer.AdminPlanListSerializer(new_plan).data,
            status_code=status.HTTP_201_CREATED,
        )
        return success_response()