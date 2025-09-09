#!/bin/bash

# Скрипт для деплоя приложения на сервер
# Запускать: bash deploy.sh

set -e

echo "🚀 Начинаем деплой Forsa Shop..."

# Переходим в директорию проекта
cd /var/www/forsa-shop

# Останавливаем приложение
echo "⏹️ Остановка приложения..."
pm2 stop forsa-shop || true

# Обновляем код из git
echo "📥 Обновление кода..."
git pull origin main

# Устанавливаем зависимости и собираем фронтенд
echo "📦 Установка зависимостей фронтенда..."
npm install

echo "🔨 Сборка фронтенда..."
npm run build

# Переходим в серверную часть
cd server

echo "📦 Установка зависимостей сервера..."
npm install

echo "🔨 Сборка сервера..."
npm run build

# Возвращаемся в корень проекта
cd ..

# Копируем конфигурацию PM2
echo "⚙️ Настройка PM2..."
cp deploy/ecosystem.config.js ./

# Создаем директории для логов
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2

# Запускаем приложение через PM2
echo "▶️ Запуск приложения..."
pm2 start ecosystem.config.js --env production

# Сохраняем конфигурацию PM2
pm2 save
pm2 startup

echo "✅ Деплой завершен успешно!"
echo "🌐 Приложение доступно на порту 3000"
echo "📋 Проверьте статус: pm2 status"
echo "📋 Логи: pm2 logs forsa-shop"
