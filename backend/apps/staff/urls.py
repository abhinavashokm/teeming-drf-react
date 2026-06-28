from django.urls import path
from .views import AdminUserListView, UserDetailView, AdminWorkspaceListView


urlpatterns = [
    path("users/", AdminUserListView.as_view()),
    path("users/<uuid:user_id>/", UserDetailView.as_view()),
    path("workspaces/", AdminWorkspaceListView.as_view()),
]
