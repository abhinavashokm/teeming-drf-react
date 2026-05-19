from django.urls import path
from .views import UserWorkspaceListView


urlpatterns = [
    path("me/", UserWorkspaceListView.as_view())
]