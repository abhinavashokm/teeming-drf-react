from django.urls import path

from .views import IdeaDetailView


urlpatterns = [
    path("<uuid:idea_id>/", IdeaDetailView.as_view()),
]