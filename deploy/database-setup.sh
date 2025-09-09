#!/bin/bash

# Скрипт для настройки базы данных MySQL
# Запускать под пользователем с правами на MySQL

echo "🗄️ Настройка базы данных MySQL..."

# Запрашиваем пароль root для MySQL
read -sp "Введите пароль root для MySQL: " MYSQL_ROOT_PASSWORD
echo

# Создаем базу данных и пользователя
echo "📊 Создание базы данных и пользователя..."

mysql -u root -p$MYSQL_ROOT_PASSWORD << EOF
-- Создаем базу данных
CREATE DATABASE IF NOT EXISTS forsa_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создаем пользователя для приложения (опционально)
CREATE USER IF NOT EXISTS 'forsa_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON forsa_shop.* TO 'forsa_user'@'localhost';
FLUSH PRIVILEGES;

-- Показываем созданные базы
SHOW DATABASES;
EOF

echo "✅ База данных настроена!"
echo ""
echo "📋 Данные для подключения:"
echo "Database: forsa_shop"
echo "Host: localhost"
echo "Port: 3306"
echo "User: root (или forsa_user)"
echo ""
echo "⚠️  Не забудьте обновить .env файл с правильными данными!"

# Импортируем данные из SQL файла, если он существует
if [ -f "/var/www/forsa-shop/scripts/forsa_shop_full.sql" ]; then
    echo "📥 Импорт данных из SQL файла..."
    mysql -u root -p$MYSQL_ROOT_PASSWORD forsa_shop < /var/www/forsa-shop/scripts/forsa_shop_full.sql
    echo "✅ Данные импортированы!"
else
    echo "⚠️  SQL файл не найден. Будет выполнена инициализация через приложение."
fi
