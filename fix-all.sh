#!/bin/bash

echo "🚀 Автоматическая настройка сервера Forsa Shop..."
cd /var/www/forsa-shop

# 1. Исправляем MySQL
echo "🔧 Исправление MySQL..."
systemctl stop mysql 2>/dev/null || true
pkill mysqld 2>/dev/null || true
sleep 5

mkdir -p /var/run/mysqld
chown mysql:mysql /var/run/mysqld
mkdir -p /var/log/mysql
chown mysql:mysql /var/log/mysql

# Полная переустановка MySQL
echo "📦 Переустановка MySQL..."
export DEBIAN_FRONTEND=noninteractive

apt-get remove --purge -y mysql-server mysql-client mysql-common mysql-server-core-8.0 mysql-client-core-8.0 2>/dev/null || true
apt-get autoremove -y
apt-get autoclean

rm -rf /var/lib/mysql
rm -rf /etc/mysql
rm -rf /var/log/mysql

# Устанавливаем новый MySQL
debconf-set-selections <<< 'mysql-server mysql-server/root_password password ForSa2024!MySQL'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password ForSa2024!MySQL'

apt-get update
apt-get install -y mysql-server

systemctl start mysql
systemctl enable mysql

# Создаем базу данных
echo "🗄️ Создание базы данных..."
mysql -u root -pForSa2024!MySQL << 'EOF'
CREATE DATABASE IF NOT EXISTS forsa_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EOF

# 2. Обновляем .env файл
echo "⚙️ Обновление конфигурации..."
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=forsa_shop
DB_USER=root
DB_PASSWORD=ForSa2024!MySQL
JWT_SECRET=forsa_potolki_super_secret_jwt_key_2024_production_83166247127
JWT_EXPIRES_IN=1d
VITE_BASE_URL=/api
DOMAIN=forsa-potolki.ru
EOF

# 3. Импортируем данные
echo "📥 Импорт данных..."
if [ -f "scripts/forsa_shop_full.sql" ]; then
    mysql -u root -pForSa2024!MySQL forsa_shop < scripts/forsa_shop_full.sql
    echo "✅ Данные импортированы!"
fi

# 4. Настраиваем Nginx (только HTTP)
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/forsa-shop << 'EOF'
server {
    listen 80;
    server_name forsa-potolki.ru www.forsa-potolki.ru;
    root /var/www/forsa-shop/dist;
    index index.html;
    client_max_body_size 10M;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/forsa-shop/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/forsa-shop
ln -s /etc/nginx/sites-available/forsa-shop /etc/nginx/sites-enabled/

nginx -t && systemctl restart nginx

# 5. Собираем приложение
echo "🔨 Сборка приложения..."
npm install
npm run build

cd server
npm install
npm run build
cd ..

# 6. Инициализируем БД
echo "🗄️ Инициализация базы данных..."
cd server
npm run init-db || echo "⚠️ Ошибка инициализации БД"
cd ..

# 7. Запускаем через PM2
echo "🚀 Запуск приложения..."
pm2 stop forsa-shop 2>/dev/null || true
pm2 delete forsa-shop 2>/dev/null || true

cp deploy/ecosystem.config.js ./
mkdir -p /var/log/pm2

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo ""
echo "🎉 Настройка завершена!"
echo "- MySQL пароль: ForSa2024!MySQL"
echo "- Сайт: http://forsa-potolki.ru"
echo ""
echo "Проверьте: pm2 status"
