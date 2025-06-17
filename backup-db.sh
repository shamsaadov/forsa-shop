#!/bin/bash

echo "💾 Создание бэкапа базы данных Forsa Shop..."

BACKUP_DIR="/var/www/forsa-shop/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/forsa_shop_$TIMESTAMP.sql"

# Создаем директорию бэкапов, если её нет
mkdir -p "$BACKUP_DIR"

# Переходим в директорию проекта
cd /var/www/forsa-shop

# Проверяем, что контейнер БД запущен
if ! docker-compose ps db | grep -q "Up"; then
    echo "❌ Ошибка: контейнер базы данных не запущен!"
    echo "Запустите: docker-compose up -d db"
    exit 1
fi

# Проверяем, что база данных существует
echo "🔍 Проверка существования базы данных..."
if ! docker-compose exec -T db mysql -u root -psecret -e "USE forsa_shop; SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Ошибка: база данных forsa_shop не существует!"
    echo "Запустите: bash restore-db.sh"
    exit 1
fi

# Создаем бэкап
echo "💾 Создание бэкапа: $BACKUP_FILE"
if docker-compose exec -T db mysqldump -u root -psecret --single-transaction --routines --triggers forsa_shop > "$BACKUP_FILE"; then
    
    # Проверяем, что бэкап не пустой
    if [ -s "$BACKUP_FILE" ] && grep -q "CREATE TABLE" "$BACKUP_FILE"; then
        # Сжимаем бэкап
        gzip "$BACKUP_FILE"
        echo "✅ Бэкап успешно создан: $BACKUP_FILE.gz"
        
        # Показываем размер файла
        ls -lh "$BACKUP_FILE.gz"
        
        # Удаляем старые бэкапы (старше 7 дней)
        find "$BACKUP_DIR" -name "forsa_shop_*.sql.gz" -mtime +7 -delete
        echo "🧹 Старые бэкапы удалены"
        
    else
        echo "❌ Ошибка: бэкап пустой или некорректный!"
        rm -f "$BACKUP_FILE"
        exit 1
    fi
    
else
    echo "❌ Ошибка при создании бэкапа!"
    rm -f "$BACKUP_FILE"
    exit 1
fi

echo "🎉 Бэкап завершен успешно!"
