#!/bin/bash

echo "📥 Восстановление базы данных из бэкапа..."

BACKUP_DIR="/var/www/forsa-shop/backups"

# Проверяем, что переданы аргументы
if [ $# -eq 0 ]; then
    echo "Доступные бэкапы:"
    ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "Бэкапы не найдены"
    echo ""
    echo "Использование: bash restore-from-backup.sh <имя_файла_бэкапа>"
    echo "Пример: bash restore-from-backup.sh forsa_shop_20250609_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Проверяем, что файл бэкапа существует
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Ошибка: файл бэкапа не найден: $BACKUP_FILE"
    exit 1
fi

# Переходим в директорию проекта
cd /var/www/forsa-shop

# Проверяем, что контейнер БД запущен
if ! docker-compose ps db | grep -q "Up"; then
    echo "❌ Ошибка: контейнер базы данных не запущен!"
    echo "Запустите: docker-compose up -d db"
    exit 1
fi

# Определяем правильный пароль root для MySQL
echo "🔍 Определение пароля root для MySQL..."
ROOT_PASSWORD=""

# Список возможных паролей
POSSIBLE_PASSWORDS=("secret" "LoremIpsum_95" "YourSecureRootPassword" "your_secure_root_password")

for password in "${POSSIBLE_PASSWORDS[@]}"; do
    if docker-compose exec -T db mysql -u root -p$password -e "SELECT 1;" >/dev/null 2>&1; then
        ROOT_PASSWORD=$password
        echo "✅ Найден рабочий пароль root: $password"
        break
    fi
done

if [ -z "$ROOT_PASSWORD" ]; then
    echo "❌ Ошибка: не удалось найти рабочий пароль root для MySQL!"
    echo "Проверьте логи БД: docker-compose logs db"
    exit 1
fi

echo "⚠️  ВНИМАНИЕ: Это действие удалит все текущие данные в базе!"
read -p "Продолжить? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Операция отменена"
    exit 1
fi

# Останавливаем приложение
echo "⏸️ Остановка приложения..."
docker-compose stop app

# Создаем базу данных заново
echo "🗄️ Пересоздание базы данных..."
docker-compose exec -T db mysql -u root -p$ROOT_PASSWORD -e "DROP DATABASE IF EXISTS forsa_shop; CREATE DATABASE forsa_shop; GRANT ALL PRIVILEGES ON forsa_shop.* TO 'app_user'@'%'; FLUSH PRIVILEGES;"

# Восстанавливаем из бэкапа
echo "📥 Восстановление из бэкапа: $1"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    # Разархивируем и восстанавливаем
    zcat "$BACKUP_FILE" | docker-compose exec -T db mysql -u root -p$ROOT_PASSWORD forsa_shop
else
    # Восстанавливаем напрямую
    cat "$BACKUP_FILE" | docker-compose exec -T db mysql -u root -p$ROOT_PASSWORD forsa_shop
fi

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно восстановлена!"
else
    echo "❌ Ошибка при восстановлении базы данных!"
    exit 1
fi

# Запускаем приложение обратно
echo "▶️ Запуск приложения..."
docker-compose up -d

# Проверяем статус
echo "✅ Проверка статуса..."
sleep 5
docker-compose ps

echo "🎉 Восстановление из бэкапа завершено!"
echo ""
echo "Проверьте работу сайта в браузере." 