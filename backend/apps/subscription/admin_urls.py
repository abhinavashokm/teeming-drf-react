from django.urls import path
from .views import AdminPlanDetailView, AdminPlanListCreateView


urlpatterns = [
    path("", AdminPlanListCreateView.as_view()),
    path("<uuid:plan_id>/", AdminPlanDetailView.as_view()),
]
