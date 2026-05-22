from django.urls import path
from .views import ResolveInvitationTokenView


urlpatterns = [
    path('<str:token>/', ResolveInvitationTokenView.as_view()),
]
