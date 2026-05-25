from django.urls import path
from .views import GoalListCreateView, GoalDetailView

urlpatterns = [
    path("", GoalListCreateView.as_view()),
    path("<uuid:goal_id>/", GoalDetailView.as_view()),
]
