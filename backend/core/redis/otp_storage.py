from .client import redis_client
from django.conf import settings

def save_otp(email, otp):
    redis_client.set(f"otp:{email}", otp, ex=settings.OTP_EXPIRY)


def get_otp(email):
    return redis_client.get(f"otp:{email}")


def delete_otp(email):
    return redis_client.delete(f"otp:{email}")


