from django.urls import path
from .views import MetricListCreateView, CheckinListCreateView


urlpatterns = [
    path("metrics/", MetricListCreateView.as_view()),
    path("checkins/", CheckinListCreateView.as_view())
]