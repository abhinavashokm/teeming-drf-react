from rest_framework.urls import path
from .views import UserListPlanView, SubscriptionCheckoutView, CurrentPlanView
from .webhook_views import StripeWebhookView


urlpatterns = [
    path("", UserListPlanView.as_view()),
    path("checkout/", SubscriptionCheckoutView.as_view()),
    path("webhook/",StripeWebhookView.as_view()),
    path("current/", CurrentPlanView.as_view()),
]