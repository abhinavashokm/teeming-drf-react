from rest_framework.urls import path
from .views import (
    UserListPlanView,
    SubscriptionCheckoutView,
    CurrentPlanView,
    CancelCurrentSubscriptionView,
    ResumeCurrentSubscription,
    SubscriptionUpgradePreviewView,
    SubscriptionUpgradeView,
)
from .webhook_views import StripeWebhookView

urlpatterns = [
    path("", UserListPlanView.as_view()),
    path("checkout/", SubscriptionCheckoutView.as_view()),
    path("webhook/", StripeWebhookView.as_view()),
    path("current/", CurrentPlanView.as_view()),
    path("cancel/", CancelCurrentSubscriptionView.as_view()),
    path("resume/", ResumeCurrentSubscription.as_view()),
    path("upgrade/<uuid:plan_id>/preview/", SubscriptionUpgradePreviewView.as_view()),
    path("upgrade/", SubscriptionUpgradeView.as_view()),
]
