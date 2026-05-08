import secrets

def generate_otp():
    otp = str(secrets.randbelow(900000) + 100000)
    return otp