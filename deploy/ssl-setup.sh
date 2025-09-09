#!/bin/bash

# Скрипт для настройки SSL сертификата через Let's Encrypt
# Запускать под root после настройки nginx

echo "🔒 Настройка SSL сертификата..."

# Запрашиваем домен
read -p "Введите ваш домен (например, forsa-potolki.ru): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Домен не указан!"
    exit 1
fi

echo "🌐 Настройка SSL для домена: $DOMAIN"

# Обновляем nginx конфигурацию с правильным доменом
sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/forsa-shop

# Проверяем конфигурацию nginx
echo "🔍 Проверка конфигурации nginx..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Ошибка в конфигурации nginx!"
    exit 1
fi

# Перезагружаем nginx
systemctl reload nginx

# Получаем SSL сертификат
echo "📜 Получение SSL сертификата..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Настраиваем автообновление сертификата
echo "🔄 Настройка автообновления сертификата..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ SSL сертификат настроен!"
echo "🌐 Ваш сайт доступен по адресу: https://$DOMAIN"

# Проверяем статус сертификата
certbot certificates
