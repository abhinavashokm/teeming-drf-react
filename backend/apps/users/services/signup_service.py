import time

from core.redis.store import set_data, get_data, delete_data
from django.conf import settings


SIGNUP_SESSION_EXPIRY = 600  # 10 minutes


def _make_key(email):
    hashed = email  # make hash here
    return f"signup:{hashed}"


def save_signup_data(email, full_name, password, otp):
    set_data(
        key=_make_key(email),
        value={
            "email": email,
            "full_name": full_name,
            "password": password,
            "otp": otp,
            "otp_expires_at": time.time() + settings.OTP_EXPIRY,
            "attempts": 0,
        },
        timeout=SIGNUP_SESSION_EXPIRY,
    )


def get_signup_data(email):
    return get_data(_make_key(email))


def delete_signup_data(email):
    delete_data(_make_key(email))
