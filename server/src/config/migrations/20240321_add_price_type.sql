-- Добавление поля price_type в таблицу products
ALTER TABLE products
ADD COLUMN price_type ENUM('square_meter', 'linear_meter', 'piece') NOT NULL DEFAULT 'square_meter' AFTER price;

-- Обновление существующих записей
UPDATE products SET price_type = 'square_meter' WHERE price_type IS NULL; 