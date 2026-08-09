#!/bin/bash

# Supabase Restore Script
# Restores Supabase database from backup

set -e

# Configuration
DATABASE_URL=${DATABASE_URL}
BACKUP_FILE=$1

if [ -z "${BACKUP_FILE}" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/supabase/supabase_backup_20240101_120000.sql.gz"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

if [ -z "${DATABASE_URL}" ]; then
    echo "Error: DATABASE_URL not set"
    exit 1
fi

echo "Starting Supabase restore from ${BACKUP_FILE}"

# Decompress backup if needed
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo "Decompressing backup..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "${BACKUP_FILE}" > "${TEMP_FILE}"
    BACKUP_FILE="${TEMP_FILE}"
fi

# Confirm restore
read -p "This will overwrite the current database. Are you sure? (yes/no): " confirm
if [ "${confirm}" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Restore database
echo "Restoring database..."
psql "${DATABASE_URL}" < "${BACKUP_FILE}"

# Clean up temporary file
if [[ "${TEMP_FILE}" == *.sql ]]; then
    rm "${TEMP_FILE}"
fi

echo "Supabase restore completed successfully"
