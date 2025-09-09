# 🚀 Быстрый старт деплоя

## 📋 Что вам нужно знать

**Данные сервера от REG.RU:**

- IP адрес: `___________`
- Логин: `root` (обычно)
- Пароль: `___________`
- Домен: `___________`

## ⚡ Быстрая установка (5 шагов)

### 1. Подключитесь к серверу

```bash
ssh root@ВАШ_IP_АДРЕС
```

### 2. Настройте сервер

```bash
curl -sSL https://raw.githubusercontent.com/ВАШ_GITHUB/forsa-potolki/main/deploy/setup-server.sh | bash
```

### 3. Скачайте проект

```bash
cd /var/www
git clone https://github.com/ВАШ_GITHUB/forsa-potolki.git forsa-shop
cd forsa-shop
```

### 4. Настройте переменные

```bash
cp deploy/.env.production .env
nano .env
# Измените: DB_PASSWORD, JWT_SECRET, DOMAIN
```

### 5. Запустите деплой

```bash
./deploy/database-setup.sh
./deploy/deploy.sh
./deploy/ssl-setup.sh
```

## ✅ Готово!

Ваш сайт будет доступен по адресу: `https://ВАШ_ДОМЕН.com`

## 🆘 Нужна помощь?

Смотрите подробную инструкцию: [deploy/README.md](deploy/README.md)

---

## 📝 Чек-лист перед деплоем

- [ ] Сервер настроен и доступен по SSH
- [ ] Домен привязан к IP адресу сервера
- [ ] Код загружен на GitHub
- [ ] В .env файле указаны правильные данные
- [ ] MySQL пароль установлен
- [ ] Nginx конфигурация обновлена с вашим доменом

## 🔧 Полезные команды на сервере

```bash
# Статус приложения
pm2 status

# Логи
pm2 logs forsa-shop

# Перезапуск
pm2 restart forsa-shop

# Статус nginx
systemctl status nginx

# Обновление кода
cd /var/www/forsa-shop && git pull && ./deploy/deploy.sh
```
