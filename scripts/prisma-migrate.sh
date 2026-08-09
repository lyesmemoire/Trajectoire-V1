#!/bin/bash

# Prisma Migration Script
# Usage: ./scripts/prisma-migrate.sh [dev|deploy|reset]

set -e

ENV=${1:-dev}

case $ENV in
  dev)
    echo "Running development migration..."
    npx prisma migrate dev
    ;;
  deploy)
    echo "Running deployment migration..."
    npx prisma migrate deploy
    ;;
  reset)
    echo "Resetting database..."
    npx prisma migrate reset
    ;;
  *)
    echo "Usage: $0 [dev|deploy|reset]"
    exit 1
    ;;
esac

echo "Migration completed successfully!"
