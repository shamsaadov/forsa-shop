#!/bin/bash

# Скрипт для настройки VPS для Forsa Shop
# Запускать под root: bash setup-vps.sh

echo "🚀 Настройка VPS для Forsa Shop..."

# Обновляем систему
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# Устанавливаем необходимые пакеты
echo "📦 Установка базовых пакетов..."
apt install -y curl wget git htop nano ufw

# Настраиваем firewall
echo "🔥 Настройка firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# Устанавливаем Docker
echo "🐳 Установка Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Устанавливаем Docker Compose
echo "🐳 Установка Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Создаем директорию для проекта
echo "📁 Создание директорий..."
mkdir -p /var/www
cd /var/www

# Генерируем SSH ключ для деплоя
echo "🔑 Генерация SSH ключа..."
ssh-keygen -t rsa -b 4096 -C "deploy@forsa-shop" -f ~/.ssh/id_rsa -N ""
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Настраиваем автоматическую очистку Docker
echo "🧹 Настройка автоматической очистки Docker..."
cat > /etc/cron.daily/docker-cleanup << 'EOF'
#!/bin/bash
# Очистка неиспользуемых Docker ресурсов
docker system prune -f
docker volume prune -f
EOF
chmod +x /etc/cron.daily/docker-cleanup

# Создаем systemd сервис для автозапуска
echo "⚙️ Создание systemd сервиса..."
cat > /etc/systemd/system/forsa-shop.service << 'EOF'
[Unit]
Description=Forsa Shop
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=true
WorkingDirectory=/var/www/forsa-shop
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl enable forsa-shop.service

echo "✅ Настройка VPS завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Скопируйте приватный SSH ключ в GitHub Secrets:"
echo "   cat ~/.ssh/id_rsa"
echo ""
echo "2. Добавьте секрет VPS_SSH_KEY в GitHub:"
echo "   GitHub → Settings → Secrets and variables → Actions"
echo ""
echo "3. Замените URL репозитория в GitHub Action на ваш"
echo ""
echo "4. Сделайте push в main ветку для автоматического деплоя"
echo ""
echo "🎉 Готово! VPS готов к работе." 