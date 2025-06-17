#!/bin/bash

echo "🔄 Восстановление базы данных Forsa Shop..."

# Переходим в директорию проекта
cd /var/www/forsa-shop

# Проверяем, что Docker Compose запущен
echo "📦 Проверка статуса контейнеров..."
docker-compose ps

# Останавливаем приложение (но оставляем БД)
echo "⏸️ Остановка приложения..."
docker-compose stop app

# Ждем несколько секунд
sleep 3

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

# Создаем базу данных, если её нет
echo "🗄️ Создание базы данных..."
docker-compose exec -T db mysql -u root -p$ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS forsa_shop; GRANT ALL PRIVILEGES ON forsa_shop.* TO 'app_user'@'%'; FLUSH PRIVILEGES;"

# Запускаем инициализацию базы данных
echo "🚀 Инициализация структуры и данных..."
docker-compose exec -T app npm run init-db

# Запускаем приложение обратно
echo "▶️ Запуск приложения..."
docker-compose up -d

# Проверяем статус
echo "✅ Проверка статуса..."
sleep 5
docker-compose ps

# Проверяем логи приложения
echo "📋 Последние логи приложения:"
docker-compose logs --tail=10 app

echo "🎉 Восстановление завершено!"
echo ""
echo "Проверьте работу сайта в браузере."
echo "Если есть ошибки, проверьте логи: docker-compose logs app" 