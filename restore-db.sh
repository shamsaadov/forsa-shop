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

# Создаем базу данных, если её нет
echo "🗄️ Создание базы данных..."
docker-compose exec -T db mysql -u root -psecret -e "CREATE DATABASE IF NOT EXISTS forsa_shop; GRANT ALL PRIVILEGES ON forsa_shop.* TO 'app_user'@'%'; FLUSH PRIVILEGES;"

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