import secrets

def generate_otp():
    otp = str(secrets.randbelow(900000) + 100000)
    return otp

def format_otp_expiry(seconds):

    if seconds % 60 == 0:
        minutes = seconds // 60
        return f"{minutes} minutes"

    return f"{seconds} seconds"