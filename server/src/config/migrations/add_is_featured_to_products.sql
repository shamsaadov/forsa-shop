-- Миграция: Добавить поле is_featured в таблицу products
-- Дата: 2025-06-04

-- Проверяем существование колонки перед добавлением
SET @dbname = DATABASE();
SET @tablename = "products";
SET @columnname = "is_featured";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE 
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER category_id"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Проверяем существование индекса перед созданием
SET @indexname = "idx_products_is_featured";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE 
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (INDEX_NAME = @indexname)
  ) > 0,
  "SELECT 1",
  "CREATE INDEX idx_products_is_featured ON products(is_featured)"
));
PREPARE createIndexIfNotExists FROM @preparedStatement;
EXECUTE createIndexIfNotExists;
DEALLOCATE PREPARE createIndexIfNotExists;

-- Обновляем комментарий к полю
ALTER TABLE products MODIFY COLUMN is_featured BOOLEAN DEFAULT FALSE COMMENT 'Товар недели (отображается в слайдере на главной)';
