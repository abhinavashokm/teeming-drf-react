from django.urls import path
from .views import RegisterView, VerifyOTPView, ResendOTPView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('resend-otp/', ResendOTPView.as_view()),
    path('login/', LoginView.as_view()),
]