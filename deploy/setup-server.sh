#!/bin/bash

# Скрипт для первоначальной настройки сервера
# Запускать под root: bash setup-server.sh

echo "🚀 Настройка сервера для Forsa Shop..."

# Обновляем систему
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# Устанавливаем необходимые пакеты
echo "📦 Установка базовых пакетов..."
apt install -y curl wget git htop nano ufw nginx mysql-server certbot python3-certbot-nginx

# Настраиваем firewall
echo "🔥 Настройка firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000

# Устанавливаем Node.js
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Устанавливаем PM2 глобально
echo "📦 Установка PM2..."
npm install -g pm2

# Настраиваем MySQL
echo "🗄️ Настройка MySQL..."
mysql_secure_installation

echo "📁 Создание директорий..."
mkdir -p /var/www/forsa-shop
cd /var/www/forsa-shop

# Создаем пользователя для приложения
echo "👤 Создание пользователя deploy..."
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy

# Настраиваем права на директорию
chown -R deploy:deploy /var/www/forsa-shop

echo "✅ Базовая настройка сервера завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте MySQL пароль root"
echo "2. Создайте базу данных forsa_shop"
echo "3. Скопируйте код проекта в /var/www/forsa-shop"
echo "4. Настройте nginx конфигурацию"
echo "5. Получите SSL сертификат"
