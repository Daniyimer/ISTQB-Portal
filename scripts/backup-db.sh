#!/bin/bash
set -e

# Configuration
CONTAINER_NAME="estqb_postgres"
DB_USER="postgres"
DB_NAME="estqb"
BACKUP_DIR="/var/backups/estqb/db"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="estqb_db_backup_$DATE.sql.gz"

echo "Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Execute pg_dump inside the container and compress it
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/$FILENAME"

echo "Backup completed successfully: $BACKUP_DIR/$FILENAME"

# Optional: keep only the last 7 days of backups
find "$BACKUP_DIR" -name "estqb_db_backup_*.sql.gz" -type f -mtime +7 -delete
echo "Old backups cleaned up."
