-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Создание таблицы категорий
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Создание таблицы характеристик товара
CREATE TABLE IF NOT EXISTS product_specifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание таблицы изображений товара
CREATE TABLE IF NOT EXISTS product_gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  address TEXT,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'card', 'bank_transfer') DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Создание таблицы элементов заказа
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Вставка демо-данных, если их еще нет
-- Администратор
INSERT INTO users (username, password, email, role)
SELECT 'admin', '$2a$10$mQP8CbFtKFAkNJXeXgJUPuq3K4SCW.xWUMwfxEd9qFgYQHQBxjWx2', 'admin@forsa-potolki.ru', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Некоторые категории
INSERT INTO categories (name, description, slug, image_url)
SELECT 'Глянцевые потолки', 'Классические глянцевые потолки с отражающей поверхностью', 'glossy', 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?q=80&w=800&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'glossy');

INSERT INTO categories (name, description, slug, image_url)
SELECT 'Матовые потолки', 'Элегантные матовые потолки для любого интерьера', 'matte', 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'matte');

INSERT INTO categories (name, description, slug, image_url)
SELECT 'Многоуровневые потолки', 'Сложные многоуровневые конструкции для оригинального дизайна', 'multilevel', 'https://images.unsplash.com/photo-1553881651-43348b2ca74e?q=80&w=800&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'multilevel');

-- Примеры товаров
INSERT INTO products (name, description, slug, price, image_url, category_id)
SELECT 'Глянцевый потолок Classic', 'Классический глянцевый потолок с высокой степенью отражения', 'glossy-classic', 900, 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=800&auto=format&fit=crop', (SELECT id FROM categories WHERE slug = 'glossy')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'glossy-classic');

INSERT INTO products (name, description, slug, price, image_url, category_id)
SELECT 'Матовый потолок Elegance', 'Элегантный матовый потолок с антибликовым покрытием', 'matte-elegance', 800, 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=800&auto=format&fit=crop', (SELECT id FROM categories WHERE slug = 'matte')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'matte-elegance');

INSERT INTO products (name, description, slug, price, image_url, category_id)
SELECT 'Многоуровневый потолок Premium', 'Многоуровневая конструкция с подсветкой и плавными переходами', 'multilevel-premium', 1500, 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=800&auto=format&fit=crop', (SELECT id FROM categories WHERE slug = 'multilevel')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'multilevel-premium');

-- Пример спецификаций для товаров
INSERT INTO product_specifications (product_id, name, value)
SELECT (SELECT id FROM products WHERE slug = 'glossy-classic'), 'Материал', 'ПВХ пленка'
WHERE NOT EXISTS (SELECT 1 FROM product_specifications WHERE product_id = (SELECT id FROM products WHERE slug = 'glossy-classic') AND name = 'Материал');

INSERT INTO product_specifications (product_id, name, value)
SELECT (SELECT id FROM products WHERE slug = 'glossy-classic'), 'Толщина', '0.18 мм'
WHERE NOT EXISTS (SELECT 1 FROM product_specifications WHERE product_id = (SELECT id FROM products WHERE slug = 'glossy-classic') AND name = 'Толщина');

-- Примеры заказов
INSERT INTO orders (customer_name, customer_email, customer_phone, address, status, total_amount, payment_method)
SELECT 'Иван Петров', 'ivan@example.com', '+7 (900) 123-45-67', 'г. Москва, ул. Примерная, д. 10, кв. 42', 'completed', 27000, 'card'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE customer_email = 'ivan@example.com' AND customer_name = 'Иван Петров');

INSERT INTO orders (customer_name, customer_email, customer_phone, address, status, total_amount, payment_method)
SELECT 'Мария Сидорова', 'maria@example.com', '+7 (900) 987-65-43', 'г. Москва, ул. Тестовая, д. 5, кв. 15', 'pending', 12000, 'cash'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE customer_email = 'maria@example.com' AND customer_name = 'Мария Сидорова');

-- Примеры позиций заказа
INSERT INTO order_items (order_id, product_id, quantity)
SELECT
  (SELECT id FROM orders WHERE customer_email = 'ivan@example.com' LIMIT 1),
  (SELECT id FROM products WHERE slug = 'glossy-classic'),
  30
WHERE EXISTS (SELECT 1 FROM orders WHERE customer_email = 'ivan@example.com')
AND EXISTS (SELECT 1 FROM products WHERE slug = 'glossy-classic')
AND NOT EXISTS (
  SELECT 1 FROM order_items
  WHERE order_id = (SELECT id FROM orders WHERE customer_email = 'ivan@example.com' LIMIT 1)
  AND product_id = (SELECT id FROM products WHERE slug = 'glossy-classic')
);

INSERT INTO order_items (order_id, product_id, quantity)
SELECT
  (SELECT id FROM orders WHERE customer_email = 'maria@example.com' LIMIT 1),
  (SELECT id FROM products WHERE slug = 'matte-elegance'),
  15
WHERE EXISTS (SELECT 1 FROM orders WHERE customer_email = 'maria@example.com')
AND EXISTS (SELECT 1 FROM products WHERE slug = 'matte-elegance')
AND NOT EXISTS (
  SELECT 1 FROM order_items
  WHERE order_id = (SELECT id FROM orders WHERE customer_email = 'maria@example.com' LIMIT 1)
  AND product_id = (SELECT id FROM products WHERE slug = 'matte-elegance')
);
