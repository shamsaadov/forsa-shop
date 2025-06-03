# Forsa Shop

Полнофункциональный интернет-магазин на React + Node.js + MySQL.

## 🚀 Технологии

**Frontend:**

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form + Zod

**Backend:**

- Node.js + Express
- TypeScript
- MySQL 8.0
- JWT Authentication
- Multer (загрузка файлов)

**DevOps:**

- Docker + Docker Compose
- GitHub Actions CI/CD

## 🛠️ Локальная разработка

### Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)

### Запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/forsa-shop.git
cd forsa-shop
```

2. Запустите проект:

```bash
docker-compose up --build
```

3. Откройте браузер: http://localhost

### Структура проекта

```
forsa-shop/
├── src/                    # Frontend (React + Vite)
├── server/                 # Backend (Node.js + Express)
├── public/                 # Статические файлы
├── docker-compose.yml      # Локальная разработка
├── docker-compose.prod.yml # Production
└── Dockerfile             # Multi-stage сборка
```

## 🌐 Развертывание на VPS

### Настройка VPS (Ubuntu/Debian)

1. **Установите Docker:**

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Установите Docker Compose:**

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Установите Git:**

```bash
sudo apt update
sudo apt install git -y
```

### Настройка GitHub Actions

1. **Создайте SSH ключ на VPS:**

```bash
ssh-keygen -t rsa -b 4096 -C "deploy@forsa-shop"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa  # Скопируйте приватный ключ
```

2. **Добавьте секрет в GitHub:**
   - Идите в Settings → Secrets and variables → Actions
   - Создайте `VPS_SSH_KEY` и вставьте приватный ключ

### Ручной деплой

```bash
# На VPS
cd /var/www
git clone https://github.com/your-username/forsa-shop.git
cd forsa-shop

# Создайте .env файл
cat > .env << EOF
MYSQL_ROOT_PASSWORD=YourSecureRootPassword
MYSQL_DATABASE=forsa
MYSQL_USER=forsa
MYSQL_PASSWORD=YourSecureAppPassword
EOF

# Запустите
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📊 API Endpoints

### Продукты

- `GET /api/products` - Все товары
- `GET /api/products/:id` - Товар по ID
- `GET /api/products/category/:categoryId` - Товары по категории

### Категории

- `GET /api/categories` - Все категории

### Авторизация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

### Заказы

- `GET /api/orders` - Заказы пользователя
- `POST /api/orders` - Создать заказ

### Админка

- `GET /api/admin/products` - Управление товарами
- `POST /api/admin/products` - Добавить товар
- `PUT /api/admin/products/:id` - Обновить товар
- `DELETE /api/admin/products/:id` - Удалить товар

## 🔧 Переменные окружения

### Production (.env)

```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=forsa
MYSQL_USER=forsa
MYSQL_PASSWORD=your_secure_app_password
```

## 🚀 Автоматический деплой

После настройки GitHub Actions каждый push в `main` ветку автоматически:

1. Подключается к VPS
2. Обновляет код
3. Пересобирает и перезапускает контейнеры
4. Проверяет статус развертывания

## 🛡️ Безопасность

- JWT токены для аутентификации
- Bcrypt для хеширования паролей
- CORS настроен для безопасности
- Переменные окружения для конфиденциальных данных
- Docker контейнеры изолированы в отдельной сети

## 📝 Лицензия

MIT License



Делаю докерфайл -> докеркомпозе -> setup-vps -> .githubAction настроить workflow до впс
docker ps -a (показывать все запущенные контейнеры)
docker log (название контейнера покажет че там)

root@box-825258:/var/www/forsa-shop# 