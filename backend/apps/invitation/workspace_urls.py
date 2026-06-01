from django.urls import path
from .views import InvitationListCreateView, CancelInvitationView

urlpatterns = [
    path('', InvitationListCreateView.as_view()),
    path('<uuid:invitation_id>/', CancelInvitationView.as_view())
]
