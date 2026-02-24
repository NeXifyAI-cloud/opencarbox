#!/bin/bash
# Script to run migrations
# Usage: ./migrate.sh [DATABASE_URL]

# Use the provided argument, or the environment variable.
DB_URL=${1:-$DATABASE_URL}

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL is not set and no argument provided."
  # Using a subshell to exit without killing the parent if sourced
  (exit 1)
fi

echo "Running migrations..."
DATABASE_URL=$DB_URL npx prisma migrate deploy
