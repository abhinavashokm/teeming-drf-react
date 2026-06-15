from django.urls import path
from .views import ImproveIdeaView


urlpatterns = [
    path("improve-idea/", ImproveIdeaView.as_view()),
]