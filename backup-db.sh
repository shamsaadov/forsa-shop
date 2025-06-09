#!/bin/bash
BACKUP_DIR="/var/www/forsa-shop/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/forsa_shop_$TIMESTAMP.sql"

cd /var/www/forsa-shop
docker-compose exec -T db mysqldump -u root -psecret forsa_shop > "$BACKUP_FILE"
gzip "$BACKUP_FILE"
find "$BACKUP_DIR" -name "forsa_shop_*.sql.gz" -mtime +7 -delete
