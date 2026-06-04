from django.urls import path

from .views import IdeaListCreateView


urlpatterns = [
    path("", IdeaListCreateView.as_view()),
]