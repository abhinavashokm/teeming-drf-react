from django.urls import path
from .views import AdminPlanListCreateView


urlpatterns = [
 path("", AdminPlanListCreateView.as_view()),
]