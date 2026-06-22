from rest_framework.urls import path
from .views import UserListPlanView, SubscriptionCheckoutView, CurrentPlanView, SubscriptionDowngradeToFreeView
from .webhook_views import StripeWebhookView


urlpatterns = [
    path("", UserListPlanView.as_view()),
    path("checkout/", SubscriptionCheckoutView.as_view()),
    path("webhook/",StripeWebhookView.as_view()),
    path("current/", CurrentPlanView.as_view()),
    path("downgrade-to-free/", SubscriptionDowngradeToFreeView.as_view()),
]