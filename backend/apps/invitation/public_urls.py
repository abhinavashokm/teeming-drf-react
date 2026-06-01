from django.urls import path
from .views import ResolveInvitationTokenView, AcceptInvitationView


urlpatterns = [
    path('<str:token>/', ResolveInvitationTokenView.as_view()),
    path('<str:token>/accept/', AcceptInvitationView.as_view()),
]
