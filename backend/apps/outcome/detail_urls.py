from django.urls import path
from .views import MetricDetailView, CheckinDetailView


urlpatterns = [
    path("metrics/<uuid:metric_id>/", MetricDetailView.as_view()),
    path("checkins/<uuid:checkin_id>/", CheckinDetailView.as_view())
]