# Загружаем переменные из .env
include .env
export $(shell sed 's/=.*//' .env)

# Настройки
MYSQL_CONTAINER = forsa-shop-db-1
DB_NAME = $(MYSQL_DATABASE)
DB_USER = root
DB_PASS = $(MYSQL_ROOT_PASSWORD)
SQL_FILE = ./scripts/forsa_shop_insert_utf8.sql

.PHONY: import dump restart-db

# Импорт SQL-дампа
import:
	docker exec -i $(MYSQL_CONTAINER) mysql -u $(DB_USER) -p$(DB_PASS) --default-character-set=utf8mb4 $(DB_NAME) < $(SQL_FILE)
	@echo "✅ Импорт завершён с кодировкой utf8mb4"

# Сделать дамп базы в файл
dump:
	docker exec $(MYSQL_CONTAINER) mysqldump -u $(DB_USER) -p$(DB_PASS) $(DB_NAME) > ./scripts/backup.sql
	@echo "✅ Бэкап сохранён в ./scripts/backup.sql"

# Перезапустить только mysql контейнер
restart-db:
	docker compose restart $(MYSQL_CONTAINER)
