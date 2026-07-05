from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from rest_framework_simplejwt.exceptions import TokenError
from django.db import transaction

from .helpers import otp_helper, signup_helper, password_reset_helper
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import User
from . import exceptions
from apps.invitation import invitation_services as invitation_services
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise


def register_user(full_name, email, password):
    """
    1] generate otp
    2] store users singup session in redis cache
    3] send verification otp to user's mail
    """

    # generate otp
    otp = otp_helper.generate_otp()

    # store signup data in redis
    signup_helper.save_signup_data(
        email=email,
        full_name=full_name,
        password=make_password(password),  # hashed password
        otp=otp,
    )

    # send otp to user's mail
    otp_helper.send_verification_otp_email(email=email, otp=otp)


def verify_otp_and_complete_signup(email, otp, invitation_token=None):
    """
    1] verify otp
    2] create user account
    3] if invitation token exists, verify and add accept it
    """

    with transaction.atomic():
        user = _verify_otp_and_create_user(email=email, otp=otp)

        joined_workspace = None

        if invitation_token:
            joined_workspace = invitation_services.verify_token_and_accept_invitation(
                invitation_token, user
            )
        return user, joined_workspace


def _verify_otp_and_create_user(email, otp):

    # get signup data from redis storage
    signup_data = signup_helper.get_signup_data(email)

    # if signup session expired
    if not signup_data:
        raise exceptions.SignupSessionExpired()

    # if otp expired
    if signup_helper.is_otp_expired(signup_data["otp_expires_at"]):
        raise exceptions.OTPExpired()

    # if invalid otp
    if signup_data["otp"] != otp:
        raise exceptions.InvalidOTP()

    # create new user (password is already hashed. so use 'create' instead of 'create_user',
    # else it will double hash password)
    user = User.objects.create(
        email=User.objects.normalize_email(email),
        password=signup_data["password"],  # already hashed password
        full_name=signup_data["full_name"],
    )

    # delete signup record
    signup_helper.delete_signup_data(email)

    return user


def resend_otp(email):

    # generate otp
    otp = otp_helper.generate_otp()

    # update otp in redis
    updated = signup_helper.update_signup_otp(email=email, otp=otp)

    if not updated:
        raise exceptions.SignupSessionExpired()

    # send otp to users mail
    otp_helper.send_verification_otp_email(email=email, otp=otp)


def login_user(request, email, password, invitation_token=None):

    with transaction.atomic():
        authenticated_user = authenticate(request, username=email, password=password)

        if not authenticated_user:
            raise exceptions.InvalidCredentials()
        
        joined_workspace = None

        if invitation_token:
            joined_workspace = invitation_services.verify_token_and_accept_invitation(invitation_token, authenticated_user)

        refresh_token = RefreshToken.for_user(authenticated_user)

        return authenticated_user, refresh_token, joined_workspace


def send_password_reset_link(email):

    # generate reset token
    reset_token = password_reset_helper.generate_token()

    # save token to redis
    password_reset_helper.save_reset_session(reset_token=reset_token, email=email)

    # build reset url link
    reset_url = password_reset_helper.build_reset_url(reset_token)

    # mail reset link to user
    password_reset_helper.send_reset_email(email=email, reset_link=reset_url)


def verify_token_and_update_password(reset_token, new_password):
    reset_session_email = password_reset_helper.get_reset_session(reset_token)

    if not reset_session_email:
        raise exceptions.InvalidPasswordResetToken()

    user = User.objects.get(email=reset_session_email)

    if user.check_password(new_password):
        raise exceptions.SamePasswordException()

    user.set_password(new_password)
    user.save()

    password_reset_helper.delete_reset_session(reset_token)


def validate_reset_token(token):
    reset_session = password_reset_helper.get_reset_session(token)

    if not reset_session:
        raise exceptions.InvalidPasswordResetToken()

    return reset_session


def get_or_update_google_user(user):
    """Get full_name from google social account and update user if empty."""
    try:
        social_account = SocialAccount.objects.get(user=user, provider="google")
        full_name = social_account.extra_data.get("name", "")
    except SocialAccount.DoesNotExist:
        full_name = user.full_name

    if not user.full_name and full_name:
        user.full_name = full_name
        user.save(update_fields=["full_name"])

    return user


def rotate_refresh_token(refresh_token):
    """
    Validates the refresh token, blacklists it, and returns
    a new access + refresh token pair.
    """
    token = RefreshToken(refresh_token)

    try:
        token = RefreshToken(refresh_token)
    except TokenError:
        raise exceptions.InvalidRefreshToken()

    new_access_token = str(token.access_token)

    # Get the user from the token payload
    user_id = token.payload.get("user_id")
    user = User.objects.get(id=user_id)

    # rotate — blacklist old, issue new refresh
    token.blacklist()
    new_refresh_token = str(RefreshToken.for_user(user))

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
    }


def update_user(user, data):
    """update user's profile with given fields"""

    for field, value in data.items():
        setattr(user, field, value)

    user.save()
    return user


def delete_user(user):
    """delete user account"""

    user.soft_delete()


def generate_tokens_for_user(user):
    return RefreshToken.for_user(user)
    

def update_last_visited_workspace(current_user, workspace):

    workspace_instance = get_workspace_or_raise(workspace_id=workspace.id)
    
    current_user.last_workspace = workspace_instance
    current_user.save()


def save_user_avatar_thumb_key(user, avatar_thumb_key, avatar_full_key):

    user.avatar_thumb_key = avatar_thumb_key
    user.avatar_full_key = avatar_full_key
    user.save()