from django.urls import path

from .views import IdeaDetailView, IdeaMoveToProgressView, IdeaMoveToDoneView, IdeaMoveToPlannedView


urlpatterns = [
    path("<uuid:idea_id>/", IdeaDetailView.as_view()),
    path("<uuid:idea_id>/move-progress/", IdeaMoveToProgressView.as_view()),
    path("<uuid:idea_id>/move-done/", IdeaMoveToDoneView.as_view()),
    path("<uuid:idea_id>/move-planned/", IdeaMoveToPlannedView.as_view())
]