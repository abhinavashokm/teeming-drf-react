from django.urls import path
from .views import (
    AdminUserListView,
    UserDetailView,
    AdminWorkspaceListView,
    AdminPlanListView,
    AdminPlanDetailView,
    AdminPlanArchiveView,
    AdminPlanRestoreView,
    AdminCreateNewPlanVersionView,
)

urlpatterns = [
    path("users/", AdminUserListView.as_view()),
    path("users/<uuid:user_id>/", UserDetailView.as_view()),
    path("workspaces/", AdminWorkspaceListView.as_view()),
    path("plans/", AdminPlanListView.as_view()),
    path("plans/<uuid:plan_id>/", AdminPlanDetailView.as_view()),
    path("plans/<uuid:plan_id>/archive/", AdminPlanArchiveView.as_view()),
    path("plans/<uuid:plan_id>/restore/", AdminPlanRestoreView.as_view()),
    path("plans/<uuid:plan_id>/new-version/", AdminCreateNewPlanVersionView.as_view()),
]
