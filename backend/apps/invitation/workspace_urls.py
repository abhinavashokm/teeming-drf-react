from django.urls import path
from .views import SendWorkspaceInvitationView

urlpatterns = [
    path('', SendWorkspaceInvitationView.as_view()),
]
