# 🚀 Деплой Forsa Shop на VPS

Пошаговая инструкция по развертыванию приложения на сервере.

## 📋 Предварительные требования

- VPS сервер с Ubuntu 20.04/22.04
- Доменное имя, привязанное к серверу
- SSH доступ к серверу

## 🛠️ Пошаговая инструкция

### 1. Подключение к серверу

```bash
ssh root@YOUR_SERVER_IP
```

### 2. Первоначальная настройка сервера

```bash
# Скачиваем и запускаем скрипт настройки
wget https://raw.githubusercontent.com/YOUR_USERNAME/forsa-potolki/main/deploy/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### 3. Клонирование проекта

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/forsa-potolki.git forsa-shop
cd forsa-shop
chown -R deploy:deploy /var/www/forsa-shop
```

### 4. Настройка переменных окружения

```bash
# Копируем шаблон и редактируем
cp deploy/.env.production .env
nano .env

# Обязательно измените:
# - DB_PASSWORD (пароль MySQL)
# - JWT_SECRET (случайная строка)
# - DOMAIN (ваш домен)
```

### 5. Настройка базы данных

```bash
chmod +x deploy/database-setup.sh
./deploy/database-setup.sh
```

### 6. Настройка Nginx

```bash
# Копируем конфигурацию nginx
cp deploy/nginx.conf /etc/nginx/sites-available/forsa-shop

# Активируем сайт
ln -s /etc/nginx/sites-available/forsa-shop /etc/nginx/sites-enabled/

# Удаляем дефолтный сайт
rm -f /etc/nginx/sites-enabled/default

# Редактируем конфигурацию (замените your-domain.com на ваш домен)
nano /etc/nginx/sites-available/forsa-shop

# Тестируем конфигурацию
nginx -t

# Перезагружаем nginx
systemctl restart nginx
```

### 7. Первый деплой

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### 8. Настройка SSL (HTTPS)

```bash
chmod +x deploy/ssl-setup.sh
./deploy/ssl-setup.sh
```

### 9. Инициализация базы данных

```bash
cd server
npm run init-db
```

## 🔄 Обновление приложения

Для обновления приложения просто запустите:

```bash
cd /var/www/forsa-shop
./deploy/deploy.sh
```

## 📊 Мониторинг

```bash
# Статус PM2
pm2 status

# Логи приложения
pm2 logs forsa-shop

# Перезапуск приложения
pm2 restart forsa-shop

# Статус Nginx
systemctl status nginx

# Логи Nginx
tail -f /var/log/nginx/forsa-shop.access.log
tail -f /var/log/nginx/forsa-shop.error.log
```

## 🐛 Решение проблем

### Проблемы с базой данных

```bash
# Проверка подключения к MySQL
mysql -u root -p

# Проверка базы данных
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p -e "USE forsa_shop; SHOW TABLES;"
```

### Проблемы с правами доступа

```bash
# Исправление прав на файлы
chown -R deploy:deploy /var/www/forsa-shop
chmod -R 755 /var/www/forsa-shop
chmod -R 755 /var/www/forsa-shop/uploads
```

### Проблемы с портами

```bash
# Проверка занятых портов
netstat -tlnp | grep :3000
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Проверка firewall
ufw status
```

## 📝 Полезные команды

```bash
# Проверка статуса всех сервисов
systemctl status nginx
systemctl status mysql
pm2 status

# Просмотр логов в реальном времени
pm2 logs forsa-shop --lines 100

# Обновление SSL сертификата
certbot renew --dry-run

# Бэкап базы данных
mysqldump -u root -p forsa_shop > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🆘 Поддержка

Если возникли проблемы:

1. Проверьте логи: `pm2 logs forsa-shop`
2. Проверьте статус сервисов: `pm2 status`
3. Проверьте конфигурацию nginx: `nginx -t`
4. Проверьте подключение к базе данных
