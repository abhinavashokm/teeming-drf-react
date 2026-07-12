#!/bin/sh
set -e

echo "Creating log files..."
mkdir -p /app/logs

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Ensuring admin panel user exists..."
python manage.py create_admin

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application