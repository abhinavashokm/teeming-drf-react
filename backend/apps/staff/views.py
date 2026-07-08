from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status

from core.responses.api_response import success_response, error_response
from . import serializers, staff_services
from apps.workspace import workspace_services
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from apps.subscription.services import (
    subscription_services,
    plan_services,
    billing_services,
)
from apps.subscription import serializers as subscription_serializer
from apps.workspace import serializers as workspace_serializer
from apps.subscription.constants import PlanCode
from rest_framework.pagination import PageNumberPagination


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    @staticmethod
    def get_pagination_details(paginator):
        return {
            "count": paginator.page.paginator.count,
            "totalPages": paginator.page.paginator.num_pages,
            "currentPage": paginator.page.number,
            "hasNext": paginator.page.has_next(),
            "hasPrevious": paginator.page.has_previous(),
        }
    

class AdminDashboardSummaryView(AdminBaseView):

    def get(self, request):

        summary = staff_services.fetch_dashboard_summary()

        return success_response(
            data=summary
        )


class AdminUserListView(AdminBaseView):
    pagination_class = AdminPageNumberPagination

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        status = request.query_params.get("status", "all").lower()
        joined = request.query_params.get("joined")

        users = staff_services.list_users(search=search, status=status, joined=joined)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(users, request, view=self)

        return success_response(
            data={
                "users": serializers.AdminUserListSerializer(page, many=True).data,
                "pagination": AdminPageNumberPagination.get_pagination_details(
                    paginator
                ),
            }
        )


class AdminListRecentSignups(AdminBaseView):
    pagination_class = AdminPageNumberPagination

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        status = request.query_params.get("status", "all").lower()

        users = staff_services.list_users(search=search, status=status, joined="today", order_by="-created_at")

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(users, request, view=self)

        return success_response(
            data={
                "users": serializers.AdminUserListSerializer(page, many=True).data,
                "pagination": AdminPageNumberPagination.get_pagination_details(
                    paginator
                ),
            }
        )


class AdminUserDetailView(AdminBaseView):

    def get(self, request, user_id):

        user = staff_services.get_user_detail(user_id=user_id)

        return success_response(data=serializers.AdminUserDetailSerializer(user).data)


class AdminWorkspaceListView(AdminBaseView):
    pagination_class = AdminPageNumberPagination

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        status = request.query_params.get("status", "all").lower()
        plan = request.query_params.get("plan", "all").lower()

        workspaces = workspace_services.list_workspaces(
            search=search,
            status=status,
            plan=plan,
        )

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(workspaces, request, view=self)

        return success_response(
            data={
                "workspaces": serializers.AdminWorkspaceListSerializer(
                    page, many=True
                ).data,
                "pagination": AdminPageNumberPagination.get_pagination_details(
                    paginator
                ),
            }
        )


class AdminWorkspaceDetailView(AdminBaseView):

    def get(self, request, workspace_id):

        workspace = get_workspace_or_raise(workspace_id=workspace_id)
        members = workspace_services.fetch_workspace_members_ordered(
            workspace=workspace
        )

        return success_response(
            data={
                "members": workspace_serializer.WorkspaceMemberSerializer(
                    members, many=True
                ).data
            }
        )


class AdminPlanListView(AdminBaseView):

    def get(self, request):
        plans = plan_services.admin_list_plans()

        return success_response(
            data={
                "plans": subscription_serializer.AdminPlanListSerializer(
                    plans, many=True
                ).data
            }
        )

    def post(self, request):

        serializer = subscription_serializer.AdminWritePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_plan = plan_services.create_plan(serializer.validated_data)

        return success_response(
            message="Plan created",
            data=subscription_serializer.AdminPlanListSerializer(new_plan).data,
            status_code=status.HTTP_201_CREATED,
        )


class AdminPlanDetailView(AdminBaseView):

    def get(self, request, plan_id):

        plan = plan_services.get_plan(plan_id=plan_id)

        return success_response(
            data=subscription_serializer.AdminPlanListSerializer(plan).data
        )

    def patch(self, request, plan_id):

        serializer = subscription_serializer.AdminPlanEditSerializer(
            data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        plan_services.update_plan(plan_id=plan_id, data=serializer.validated_data)

        return success_response(message="Plan updated")


class AdminFreePlanUpdateView(AdminBaseView):

    def patch(self, request):

        serializer = subscription_serializer.AdminFreePlanUpdateSerializer(
            data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        plan_services.update_free_plan(data=serializer.validated_data)

        return success_response(message="Free plan updated")


class AdminCreateNewPlanVersionView(AdminBaseView):

    def post(self, request, plan_id):

        plan = plan_services.get_plan(plan_id=plan_id)

        serializer = subscription_serializer.AdminPlanNewVersionSerializer(
            data=request.data, context={"plan": plan}
        )
        serializer.is_valid(raise_exception=True)

        new_plan = plan_services.create_new_plan_version(
            plan_id=plan_id, data=serializer.validated_data
        )

        return success_response(
            message="New version created",
            data=subscription_serializer.AdminPlanNewVersionSerializer(new_plan).data,
        )


class AdminPlanArchiveView(AdminBaseView):

    def post(self, request, plan_id):

        plan_services.archive_plan(plan_id=plan_id)

        return success_response(message="Plan archived.")


class AdminPlanRestoreView(AdminBaseView):

    def post(self, request, plan_id):

        plan_services.restore_plan(plan_id=plan_id)

        return success_response(message="Plan restored.")


class AdminTransactionListView(AdminBaseView):

    def get(self, request):
        year = request.query_params.get("year", "all").lower()
        month = request.query_params.get("month", "all").lower()
        search = request.query_params.get("search", "").strip()

        transactions = subscription_services.admin_list_transactions(
            year=year,
            month=month,
            search=search,
        )

        return success_response(
            data={
                "transactions": subscription_serializer.AdminTransactionListSerializer(
                    transactions, many=True
                ).data
            }
        )


class AdminBillingOverviewView(AdminBaseView):

    def get(self, request):

        data = billing_services.get_billing_overview()

        serializer = subscription_serializer.BillingOverviewSerializer(data)

        return success_response(data=serializer.data)
