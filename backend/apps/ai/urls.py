from django.urls import path
from .views import ImproveIdeaView, AIAssistantView


urlpatterns = [
    path("improve-idea/", ImproveIdeaView.as_view()),
    path("assistant/", AIAssistantView.as_view())
]