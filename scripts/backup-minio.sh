#!/bin/bash
set -e

# Configuration
# This uses the MinIO Client (mc) to mirror the bucket to a local directory or remote S3
# Ensure you have 'mc' installed and configured (e.g. `mc alias set myminio http://localhost:9000 admin password`)

SOURCE="myminio/estqb-files"
DEST_DIR="/var/backups/estqb/files/$(date +"%Y%m%d")"

echo "Starting MinIO backup..."

mkdir -p "$DEST_DIR"

# Mirror the bucket to the backup directory
# mc mirror [OPTIONS] SOURCE TARGET
mc mirror "$SOURCE" "$DEST_DIR"

echo "Backup completed successfully to $DEST_DIR"

# Note for Restore: 
# To restore, run the mirror command in reverse:
# mc mirror "$DEST_DIR" "$SOURCE"
