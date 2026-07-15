from django.urls import path
from .views import (
    AdminUserListView,
    AdminUserDetailView,
    AdminWorkspaceListView,
    AdminWorkspaceDetailView,
    AdminPlanListView,
    AdminPlanDetailView,
    AdminPlanArchiveView,
    AdminPlanRestoreView,
    AdminCreateNewPlanVersionView,
    AdminTransactionListView,
    AdminRevenueSummaryView,
    AdminFreePlanUpdateView,
    AdminDashboardSummaryView,
    AdminRevenueTrendView,
)

urlpatterns = [
    path("dashboard/summary/", AdminDashboardSummaryView.as_view()),
    path("users/", AdminUserListView.as_view()),
    path("users/<uuid:user_id>/", AdminUserDetailView.as_view()),
    path("workspaces/", AdminWorkspaceListView.as_view()),
    path("workspaces/<uuid:workspace_id>/", AdminWorkspaceDetailView.as_view()),
    path("plans/", AdminPlanListView.as_view()),
    path("plans/<uuid:plan_id>/", AdminPlanDetailView.as_view()),
    path("plans/free/", AdminFreePlanUpdateView.as_view()),
    path("plans/<uuid:plan_id>/archive/", AdminPlanArchiveView.as_view()),
    path("plans/<uuid:plan_id>/restore/", AdminPlanRestoreView.as_view()),
    path("plans/<uuid:plan_id>/new-version/", AdminCreateNewPlanVersionView.as_view()),
    path("transactions/", AdminTransactionListView.as_view()),
    path("billing/revenue/trend/", AdminRevenueTrendView.as_view()),
    path("billing/revenue/summary/", AdminRevenueSummaryView.as_view()),
]
