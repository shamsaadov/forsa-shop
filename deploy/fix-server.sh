#!/bin/bash

# Полный скрипт автоматической настройки сервера Forsa Shop
echo "🚀 Автоматическая настройка сервера Forsa Shop..."

# Переходим в директорию проекта
cd /var/www/forsa-shop

# 1. Исправляем MySQL
echo "🔧 Исправление MySQL..."

# Останавливаем все процессы MySQL
systemctl stop mysql 2>/dev/null || true
pkill mysqld 2>/dev/null || true
sleep 5

# Создаем необходимые директории
mkdir -p /var/run/mysqld
chown mysql:mysql /var/run/mysqld
mkdir -p /var/log/mysql
chown mysql:mysql /var/log/mysql

# Полная переустановка MySQL для чистого старта
echo "📦 Переустановка MySQL..."
export DEBIAN_FRONTEND=noninteractive

# Удаляем старый MySQL
apt-get remove --purge -y mysql-server mysql-client mysql-common mysql-server-core-8.0 mysql-client-core-8.0 2>/dev/null || true
apt-get autoremove -y
apt-get autoclean

# Удаляем старые данные
rm -rf /var/lib/mysql
rm -rf /etc/mysql
rm -rf /var/log/mysql

# Устанавливаем новый MySQL с автоматическими ответами
debconf-set-selections <<< 'mysql-server mysql-server/root_password password ForSa2024!MySQL'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password ForSa2024!MySQL'

apt-get update
apt-get install -y mysql-server

# Запускаем MySQL
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

# 3. Импортируем данные в базу
echo "📥 Импорт данных..."
if [ -f "scripts/forsa_shop_full.sql" ]; then
    mysql -u root -pForSa2024!MySQL forsa_shop < scripts/forsa_shop_full.sql
    echo "✅ Данные импортированы!"
else
    echo "⚠️ SQL файл не найден, будет выполнена инициализация через приложение"
fi

# 4. Настраиваем Nginx (только HTTP, без SSL)
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/forsa-shop << 'EOF'
server {
    listen 80;
    server_name forsa-potolki.ru www.forsa-potolki.ru;

    # Корневая директория для статических файлов
    root /var/www/forsa-shop/dist;
    index index.html;

    # Размер загружаемых файлов
    client_max_body_size 10M;

    # Логи
    access_log /var/log/nginx/forsa-shop.access.log;
    error_log /var/log/nginx/forsa-shop.error.log;

    # API проксирование на Node.js сервер
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
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Статические файлы загрузок
    location /uploads {
        alias /var/www/forsa-shop/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        
        # CORS для загрузок
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
    }

    # SPA fallback - все остальные запросы направляем на index.html
    location / {
        try_files $uri $uri/ /index.html;
        
        # Кеширование статических файлов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # HTML файлы не кешируем
        location ~* \.(html)$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Скрываем версию nginx
    server_tokens off;
}
EOF

# Активируем сайт
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/forsa-shop
ln -s /etc/nginx/sites-available/forsa-shop /etc/nginx/sites-enabled/

# Проверяем и перезапускаем nginx
nginx -t
if [ $? -eq 0 ]; then
    systemctl restart nginx
    echo "✅ Nginx настроен и запущен"
else
    echo "❌ Ошибка в конфигурации Nginx"
    nginx -t
fi

# 5. Собираем и запускаем приложение
echo "🔨 Сборка приложения..."

# Устанавливаем зависимости фронтенда
npm install
npm run build

# Переходим в серверную часть
cd server
npm install
npm run build
cd ..

# 6. Инициализируем базу данных
echo "🗄️ Инициализация базы данных..."
cd server
npm run init-db || echo "⚠️ Ошибка инициализации БД, но продолжаем..."
cd ..

# 7. Запускаем приложение через PM2
echo "🚀 Запуск приложения..."

# Останавливаем старые процессы
pm2 stop forsa-shop 2>/dev/null || true
pm2 delete forsa-shop 2>/dev/null || true

# Копируем конфигурацию PM2
cp deploy/ecosystem.config.js ./

# Создаем директории для логов
mkdir -p /var/log/pm2
chown -R root:root /var/log/pm2

# Запускаем приложение
pm2 start ecosystem.config.js --env production

# Сохраняем конфигурацию PM2
pm2 save
pm2 startup

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📋 Информация:"
echo "- MySQL пароль: ForSa2024!MySQL"
echo "- База данных: forsa_shop"
echo "- Сайт: http://forsa-potolki.ru"
echo "- API: http://forsa-potolki.ru/api"
echo ""
echo "📊 Проверка статуса:"
echo "- pm2 status"
echo "- systemctl status nginx"
echo "- systemctl status mysql"
echo ""
echo "🔍 Логи:"
echo "- pm2 logs forsa-shop"
echo "- tail -f /var/log/nginx/forsa-shop.error.log"
