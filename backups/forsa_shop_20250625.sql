-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: forsa_shop
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `slug` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Профили',NULL,'profili',NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(2,'Торцы',NULL,'tortsy',NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(3,'Вставки',NULL,'vstavki',NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(4,'Гардины',NULL,'gardiny',NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) NOT NULL,
  `address` text,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','bank_transfer') DEFAULT 'cash',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,'Иван Петров','ivan@example.com','+7 (900) 123-45-67','г. Москва, ул. Примерная, д. 10, кв. 42','completed',27000.00,'card',NULL,'2025-06-17 07:58:23','2025-06-17 07:58:23'),(2,NULL,'Мария Сидорова','maria@example.com','+7 (900) 987-65-43','г. Москва, ул. Тестовая, д. 5, кв. 15','pending',12000.00,'cash',NULL,'2025-06-17 07:58:23','2025-06-17 07:58:23');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_gallery`
--

DROP TABLE IF EXISTS `product_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_gallery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_gallery`
--

LOCK TABLES `product_gallery` WRITE;
/*!40000 ALTER TABLE `product_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_specifications`
--

DROP TABLE IF EXISTS `product_specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_specifications_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_specifications`
--

LOCK TABLES `product_specifications` WRITE;
/*!40000 ALTER TABLE `product_specifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `slug` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_type` enum('square_meter','linear_meter','piece') NOT NULL DEFAULT 'square_meter',
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0' COMMENT 'Товар недели (отображается в слайдере на главной)',
  `stock` int DEFAULT '0',
  `category_ids` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `idx_products_is_featured` (`is_featured`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (25,'Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 2м','Описание товара: Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 2м','profil-pk-14-matovyy-belyy-2m',950.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',1,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(26,'Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 3,2м','Описание товара: Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 3,2м','profil-pk-14-matovyy-belyy-32m',950.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',1,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(27,'Профиль ПК-14 МАТОВЫЙ ЧЕРНЫЙ 2м','Описание товара: Профиль ПК-14 МАТОВЫЙ ЧЕРНЫЙ 2м','profil-pk-14-matovyy-chernyy-2m',950.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',1,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(28,'торец для пк-14 3D резка белый (гарпунная заправка) 1 штука','Описание товара: торец для пк-14 3D резка белый (гарпунная заправка) 1 штука','torets-dlya-pk-14-3d-rezka-belyy-garpunnaya-zapravka-1-shtuka',400.00,'piece','https://via.placeholder.com/600x400?text=No+Image',2,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(29,'торец БЕЛЫЙ для пк-14 Лаз. резка (заклейка) (компл. 2 шт)','Описание товара: торец БЕЛЫЙ для пк-14 Лаз. резка (заклейка) (компл. 2 шт)','torets-belyy-dlya-pk-14-laz-rezka-zakleyka-kompl-2-sht',500.00,'piece','https://via.placeholder.com/600x400?text=No+Image',2,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(30,'вставка в пк14 белая','Описание товара: вставка в пк14 белая','vstavka-v-pk14-belaya',50.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',3,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(31,'вставка в пк14 черная','Описание товара: вставка в пк14 черная','vstavka-v-pk14-chernaya',50.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',3,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(32,'торец ЧЕРНЫЙ для пк-14 Лаз. резка (заклейка) (компл. 2 шт)','Описание товара: торец ЧЕРНЫЙ для пк-14 Лаз. резка (заклейка) (компл. 2 шт)','torets-chernyy-dlya-pk-14-laz-rezka-zakleyka-kompl-2-sht',500.00,'piece','https://via.placeholder.com/600x400?text=No+Image',2,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(33,'торец для пк-14 3D резка черный (гарпунная заправка) 1 штука','Описание товара: торец для пк-14 3D резка черный (гарпунная заправка) 1 штука','torets-dlya-pk-14-3d-rezka-chernyy-garpunnaya-zapravka-1-shtuka',400.00,'piece','https://via.placeholder.com/600x400?text=No+Image',2,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(34,'Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 3,5м','Описание товара: Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 3,5м','profil-pk-14-matovyy-belyy-35m',950.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',1,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(35,'Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 2,5м','Описание товара: Профиль ПК-14 МАТОВЫЙ БЕЛЫЙ 2,5м','profil-pk-14-matovyy-belyy-25m',950.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',1,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(36,'Гардина 05 П-образная белая 2м (аналог)','Описание товара: Гардина 05 П-образная белая 2м (аналог)','gardina-05-p-obraznaya-belaya-2m-analog',900.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(37,'Гардина 05 П-образная белая 2,5м (аналог)','Описание товара: Гардина 05 П-образная белая 2,5м (аналог)','gardina-05-p-obraznaya-belaya-25m-analog',900.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(38,'Гардина 05 П-образная белая 3м (аналог)','Описание товара: Гардина 05 П-образная белая 3м (аналог)','gardina-05-p-obraznaya-belaya-3m-analog',900.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(39,'Гардина 05 П-образная белая 3,5м (аналог)','Описание товара: Гардина 05 П-образная белая 3,5м (аналог)','gardina-05-p-obraznaya-belaya-35m-analog',900.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(40,'Гардина Ф1 П-образная белая 2,5м','Описание товара: Гардина Ф1 П-образная белая 2,5м','gardina-f1-p-obraznaya-belaya-25m',870.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(41,'Гардина Ф1 П-образная белая 2м','Описание товара: Гардина Ф1 П-образная белая 2м','gardina-f1-p-obraznaya-belaya-2m',870.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(42,'Гардина Ф1 П-образная белая 3м','Описание товара: Гардина Ф1 П-образная белая 3м','gardina-f1-p-obraznaya-belaya-3m',870.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(43,'Гардина Ф1 П-образная белая 3,5м','Описание товара: Гардина Ф1 П-образная белая 3,5м','gardina-f1-p-obraznaya-belaya-35m',870.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31'),(44,'Гардина Ф1 П-образная белая 4м','Описание товара: Гардина Ф1 П-образная белая 4м','gardina-f1-p-obraznaya-belaya-4m',870.00,'linear_meter','https://via.placeholder.com/600x400?text=No+Image',4,0,0,NULL,'2025-06-24 16:13:31','2025-06-24 16:13:31');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890','admin','$2a$10$mQP8CbFtKFAkNJXeXgJUPuq3K4SCW.xWUMwfxEd9qFgYQHQBxjWx2','admin@forsa-potolki.ru','admin','2025-06-17 07:58:23','2025-06-17 07:58:23'),('b7550223-2ad3-4195-a7d9-06e7b7eed2be','admin1','$2b$10$FH2KXQMh.HXp.UDggwAGOOooW6se0TVEiWvBi5.Bt.dOtO9wFc80.',NULL,'admin','2025-06-17 08:01:23','2025-06-17 08:01:23');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24 23:00:01
