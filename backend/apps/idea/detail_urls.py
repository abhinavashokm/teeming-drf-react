from django.urls import path

from .views import IdeaDetailView, IdeaMoveToProgressView


urlpatterns = [
    path("<uuid:idea_id>/", IdeaDetailView.as_view()),
    path("<uuid:idea_id>/move-progress/", IdeaMoveToProgressView.as_view()),
]