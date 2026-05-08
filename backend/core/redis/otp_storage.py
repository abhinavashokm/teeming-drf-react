from .client import redis_client

#in seconds. 300s -> 5min
OTP_EXPIRY = 300


def save_otp(email, otp):
    redis_client.set(f"otp:{email}", otp, ex=OTP_EXPIRY)


def get_otp(email):
    return redis_client.get(f"otp:{email}")


def delete_otp(email):
    return redis_client.delete(f"otp:{email}")


