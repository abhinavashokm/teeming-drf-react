import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Creates a default staff/admin user for the website's admin panel, if one doesn't already exist"

    def handle(self, *args, **options):
        User = get_user_model()

        email = os.environ.get('ADMIN_PANEL_EMAIL')
        password = os.environ.get('ADMIN_PANEL_PASSWORD')

        if not email or not password:
            self.stdout.write(self.style.WARNING(
                'ADMIN_PANEL_EMAIL / ADMIN_PANEL_PASSWORD not set — skipping admin user creation'
            ))
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.SUCCESS(f'Admin panel user {email} already exists — skipping'))
            return

        User.objects.create_user(
            email=email,
            password=password,
            is_staff=True,   # this is what your admin panel's Role column checks
        )

        self.stdout.write(self.style.SUCCESS(f'Created admin panel user: {email}'))