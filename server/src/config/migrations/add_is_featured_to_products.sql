-- Миграция: Добавить поле is_featured в таблицу products
-- Дата: 2025-06-04

ALTER TABLE products
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER category_id;

-- Создать индекс для быстрого поиска товаров недели
CREATE INDEX idx_products_is_featured ON products(is_featured);

-- Комментарий к полю
ALTER TABLE products MODIFY COLUMN is_featured BOOLEAN DEFAULT FALSE COMMENT 'Товар недели (отображается в слайдере на главной)';
