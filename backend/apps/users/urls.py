from django.urls import path, include

from .views import (
    RegisterView,
    VerifyOTPView,
    LoginView,
    ForgotPasswordView,
    ResetPasswordView,
    ResendOTPView,
    RefreshTokenView,
    MeView,
    CookieTokenBlacklistView,
    GoogleLoginView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("resend-otp/", ResendOTPView.as_view()),
    path("login/", LoginView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),
    path("refresh/", RefreshTokenView.as_view()),
    path("me/", MeView.as_view()),
    path("logout/", CookieTokenBlacklistView.as_view(), name="logout"),

    # google Oauth urls
    path("", include("dj_rest_auth.urls")),
    path('accounts/', include('allauth.urls')),
    path("registration/", include("dj_rest_auth.registration.urls")),
    path("social/google/", GoogleLoginView.as_view()),
]