#!/bin/bash
set -e

echo "Starting application..."

# Wait for database
echo "Waiting for database..."
/wait-for-it.sh db 5432

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Create admin user
echo "Creating admin user..."
python create_admin.py

# Start the application
echo "Starting application server..."
if [ "$ENVIRONMENT" = "production" ]; then
    exec gunicorn app.main:app  -w 4 -k uvicorn.workers.UvicornWorker  -b 0.0.0.0:8000    --log-level debug
else
    exec uvicorn app.main:app --proxy-headers --forwarded-allow-ips="*" --host 0.0.0.0 --port 8000
fi 