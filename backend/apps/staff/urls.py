from django.urls import path
from .views import UserManagementView, UserDetailView


urlpatterns = [
    path("users/", UserManagementView.as_view()),
    path("users/<uuid:user_id>/", UserDetailView.as_view()),
]
