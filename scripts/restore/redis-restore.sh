#!/bin/bash

# Redis Restore Script
# Restores Redis data from backup

set -e

# Configuration
REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=${REDIS_PASSWORD}
BACKUP_FILE=$1

if [ -z "${BACKUP_FILE}" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/redis/redis_backup_20240101_120000.rdb.gz"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "Starting Redis restore from ${BACKUP_FILE}"

# Stop Redis (if running as service)
echo "Stopping Redis..."
# systemctl stop redis || service redis stop || echo "Redis stop skipped (not running as service)"

# Decompress backup if needed
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo "Decompressing backup..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "${BACKUP_FILE}" > "${TEMP_FILE}"
    BACKUP_FILE="${TEMP_FILE}"
fi

# Copy RDB file to Redis data directory
REDIS_DATA_DIR=$(redis-cli CONFIG GET dir | tail -1)
echo "Redis data directory: ${REDIS_DATA_DIR}"

# Backup current RDB file
if [ -f "${REDIS_DATA_DIR}/dump.rdb" ]; then
    cp "${REDIS_DATA_DIR}/dump.rdb" "${REDIS_DATA_DIR}/dump.rdb.backup"
fi

# Copy backup file
cp "${BACKUP_FILE}" "${REDIS_DATA_DIR}/dump.rdb"

# Start Redis
echo "Starting Redis..."
# systemctl start redis || service redis start || echo "Redis start skipped (not running as service)"

# Clean up temporary file
if [[ "${TEMP_FILE}" == *.rdb ]]; then
    rm "${TEMP_FILE}"
fi

echo "Redis restore completed successfully"
