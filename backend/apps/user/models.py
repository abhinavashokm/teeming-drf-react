import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from core.models import BaseAbstractModel


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    # used when python3 manage.py createsuperuser
    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, BaseAbstractModel):

    class PlanChoices(models.TextChoices):
        FREE = "FREE", "Free"
        PRO = "PRO", "Pro"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    avatar_url = models.URLField(blank=True, null=True)

    current_plan = models.CharField(
        default=PlanChoices.FREE,
        choices=PlanChoices.choices,
        help_text="Pro subscription status",
    )

    last_workspace = models.ForeignKey(
        "workspace.Workspace",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="last_active_users",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    # Hide AbstractUser's fields
    username = None
    first_name = None
    last_name = None

    objects = UserManager()

    def __str__(self):
        return self.email
