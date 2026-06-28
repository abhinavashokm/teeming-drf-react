from core.exceptions.base import NotFoundException
from ..models import User


def get_user_or_raise(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise NotFoundException("User not found")
