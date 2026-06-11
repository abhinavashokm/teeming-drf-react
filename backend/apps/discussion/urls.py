from django.urls import path
from .views import DiscussionListView


urlpatterns = [
    path("", DiscussionListView.as_view()),
]