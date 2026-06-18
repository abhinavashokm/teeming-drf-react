from django.conf import settings

def set_refresh_cookie(refresh_token, response):
    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=True if settings.DEBUG else True,
        samesite="None" if settings.DEBUG else "Lax",
        max_age=settings.REFRESH_TOKEN_MAX_AGE,
    )

    return response
