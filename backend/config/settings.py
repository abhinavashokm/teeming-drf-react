import os
import stripe
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG") == "True"
DEBUG_API_DELAY = DEBUG
MOCK_RESPONSE_DELAY = float(os.getenv("MOCK_RESPONSE_DELAY"))  # in seconds

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # installed apps
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "channels",
    # google Oauth apps
    "rest_framework.authtoken",
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "dj_rest_auth",
    # myapps
    "core",
    "apps.user",
    "apps.workspace",
    "apps.invitation",
    "apps.goal",
    "apps.idea",
    "apps.outcome",
    "apps.notification",
    "apps.discussion",
    "apps.subscription",
    "apps.ai",
    "apps.staff",
]

ASGI_APPLICATION = "config.asgi.application"

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}

# For Django Channels WebSocket origin check
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # google Oauth
    "allauth.account.middleware.AccountMiddleware",
    # tenant/workspace resolution
    "core.middleware.WorkspaceMiddleware",
    # development only - mock delay in response
    "core.middleware.ResponseDelayMiddleware",
]

FRONTEND_URL = os.getenv("FRONTEND_URL")

CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:5173",
]

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "ngrok-skip-browser-warning",
]

CORS_ALLOW_CREDENTIALS = True


ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [f"{BASE_DIR}/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / 'staticfiles'

AUTH_USER_MODEL = "user.User"


# -----------------------------------------------------------------------------
# Email service
# -----------------------------------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")


# -----------------------------------------------------------------------------
# Redis configuration
# -----------------------------------------------------------------------------

REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}


# -----------------------------------------------------------------------------
# JWT setup and custom exception
# -----------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "EXCEPTION_HANDLER": "core.exceptions.handler.custom_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",
        "user": "500/minute",
        "auth": "50/minute",  # login, refresh, register
        "sensitive": "5/minute",  # password reset, email verify
        "ai": "20/hour",  # ai features
        "dj_rest_auth": "10/minute",
    },
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60) if not DEBUG else timedelta(days=3),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60  # 7days (in seconds)

# expiry time's configuration
OTP_EXPIRY = 60 * 60  # in seconds. 60min - for testing
SIGNUP_SESSION_EXPIRY = 60 * 15  # 15 minutes
PASSWORD_RESET_LINK_EXPIRY = 60 * 30  # 30 minutes

# Expiry snaps to end of calculated day. (so always keep the meausre in days to avoid inconsistent behaviours)
INVITATION_EXPIRY = 60 * 60 * 24 * 7  # 7 days.


# Google OAuth configs
SITE_ID = 1

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
            "secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
            "key": "",
        },
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
        "OAUTH_PKCE_ENABLED": True,
    }
}


# return JWT instead of session
REST_AUTH = {
    "USE_JWT": True,
}

SOCIALACCOUNT_ADAPTER = "apps.user.adapters.CustomSocialAccountAdapter"

# disable signup redirect — handle via API only
SOCIALACCOUNT_AUTO_SIGNUP = True  # auto create user, no signup page
ACCOUNT_EMAIL_VERIFICATION = "none"  # or 'mandatory'

# key setting — connect social account to existing user with same email
SOCIALACCOUNT_EMAIL_AUTHENTICATION = True
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True

ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"

# -----------------------------------------------------------------------------
# STRIPE PAYMENT GATEWAY CONIFGURATION
# -----------------------------------------------------------------------------
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

stripe.api_key = STRIPE_SECRET_KEY


# -----------------------------------------------------------------------------
# AI INTEGRATION
# -----------------------------------------------------------------------------
AI_PROVIDER = os.environ.get("AI_PROVIDER", default="gemini")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get(
    "GEMINI_MODEL",
    default="gemini-2.5-flash",
)
USE_MOCK_AI = os.getenv("USE_MOCK_AI", "False").lower() == "true"

# -----------------------------------------------------------------------------
# S3 Bucket configuration
# -----------------------------------------------------------------------------
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")

AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME")

# -----------------------------------------------------------------------------
# Logger configs
# -----------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{asctime} {levelname} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "websocket_file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "websocket.log",
            "formatter": "verbose",
        },
        "s3bucket_file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "s3bucket.log",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "billing": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "websocket": {
            "handlers": ["websocket_file"],
            "level": "INFO",
            "propagate": False,
        },
        "s3bucket": {
            "handlers": ["s3bucket_file"],
            "level": "ERROR",
            "propagate": False,
        },
        "celery": {
        "handlers": ["console"],
        "level": "INFO",
        "propagate": False,
    },
    },
}

# -----------------------------------------------------------------------------
# celery settings
# -----------------------------------------------------------------------------
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'