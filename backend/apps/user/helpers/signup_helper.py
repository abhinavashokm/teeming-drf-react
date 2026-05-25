import time

from core import redis_store
from django.conf import settings


def _make_key(email):
    return redis_store.make_key(prefix="signup", identifier=email)


def save_signup_data(email, full_name, password, otp):
    redis_store.set_data(
        key=_make_key(email),
        value={
            "email": email,
            "full_name": full_name,
            "password": password,
            "otp": otp,
            "otp_expires_at": time.time() + settings.OTP_EXPIRY,
            "attempts": 0,
        },
        timeout=settings.SIGNUP_SESSION_EXPIRY,
    )


def signup_data_exists(email):
    return redis_store.exists(_make_key(email))


def update_signup_otp(email, otp):

    signup_data = get_signup_data(email)
    if signup_data is None:
        return False
    
    signup_data['otp'] = otp
    signup_data['otp_expires_at'] = time.time() + settings.OTP_EXPIRY

    redis_store.set_data(
        key=_make_key(email),
        value=signup_data,
        timeout=settings.SIGNUP_SESSION_EXPIRY
    )

    return True
    

def get_signup_data(email):
    return redis_store.get_data(_make_key(email))


def delete_signup_data(email):
    redis_store.delete_data(_make_key(email))


def is_otp_expired(otp_expires_at):
    return float(otp_expires_at) < time.time()
