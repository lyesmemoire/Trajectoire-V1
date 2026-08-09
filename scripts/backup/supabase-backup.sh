#!/bin/bash

# Supabase Backup Script
# Backs up Supabase database and storage

set -e

# Configuration
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
BACKUP_DIR="./backups/supabase"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/supabase_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting Supabase backup at ${TIMESTAMP}"

# Backup database using pg_dump
if [ -n "${DATABASE_URL}" ]; then
    echo "Backing up database..."
    pg_dump "${DATABASE_URL}" > "${BACKUP_FILE}"
    echo "Database backup saved to ${BACKUP_FILE}"
else
    echo "DATABASE_URL not set, skipping database backup"
fi

# Backup storage (using Supabase CLI if available)
if command -v supabase &> /dev/null; then
    echo "Backing up storage..."
    supabase db dump -f "${BACKUP_FILE}.storage" || echo "Storage backup skipped"
fi

# Compress backup
echo "Compressing backup..."
gzip "${BACKUP_FILE}"
echo "Backup compressed to ${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
echo "Cleaning up old backups..."
find "${BACKUP_DIR}" -name "supabase_backup_*.sql.gz" -mtime +7 -delete

echo "Supabase backup completed successfully"
