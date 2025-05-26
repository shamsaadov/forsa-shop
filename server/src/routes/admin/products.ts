import express from "express";
import productModel from "../../models/product";

const router = express.Router();

// Получить все товары (для админки)
router.get("/", async (_, res) => {
  try {
    const products = await productModel.getAllProducts(100, 0);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products for admin:", error);
    res.status(500).json({ message: "Ошибка при получении товаров" });
  }
});

// Получить товар по ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный ID товара" });
    }

    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product for admin:", error);
    res.status(500).json({ message: "Ошибка при получении товара" });
  }
});

// Создать новый товар
router.post("/", async (req: any, res: any) => {
  try {
    const {
      name,
      description,
      slug,
      price,
      image_url,
      category_ids,
      specifications,
      stock,
    } = req.body;

    // Базовая валидация
    if (!name || !slug || !price || category_ids.length === 0) {
      return res.status(400).json({
        message:
          "Необходимо указать название, URL, цену и хотя бы одну категорию",
      });
    }

    // Создание товара
    const productId = await productModel.createProduct({
      name,
      description: description || null,
      slug,
      price: parseFloat(price),
      image_url: image_url || null,
      category_id: parseInt(category_ids[0]),
      stock: stock,
    });

    // Если есть спецификации, добавляем их
    if (specifications && specifications.length > 0) {
      for (const spec of specifications) {
        if (spec.name && spec.value) {
          await productModel.addProductSpecification(productId, {
            name: spec.name,
            value: spec.value,
          });
        }
      }
    }

    // Если есть галерея изображений, добавляем их
    if (req.body.gallery_images && req.body.gallery_images.length > 0) {
      for (let i = 0; i < req.body.gallery_images.length; i++) {
        const imageUrl = req.body.gallery_images[i];
        if (imageUrl) {
          await productModel.addProductGalleryImage(
            productId,
            imageUrl,
            i === 0,
          ); // Первое изображение делаем главным
        }
      }
    }

    const newProduct = await productModel.getProductById(productId);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Ошибка при создании товара" });
  }
});

// Обновить товар
router.put("/:id", async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный ID товара" });
    }

    const {
      name,
      description,
      slug,
      price,
      image_url,
      category_ids,
      specifications,
    } = req.body;

    // Проверяем, существует ли товар
    const existingProduct = await productModel.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Обновляем основные данные товара
    await productModel.updateProduct(productId, {
      name,
      description,
      slug,
      price: parseFloat(price),
      image_url,
      category_id: parseInt(category_ids[0]), // Берем первую категорию как основную
    });

    // Если есть спецификации, обновляем их
    if (specifications) {
      // Сначала удаляем все старые спецификации
      await productModel.deleteProductSpecifications(productId);

      // Затем добавляем новые
      for (const spec of specifications) {
        if (spec.name && spec.value) {
          await productModel.addProductSpecification(productId, {
            name: spec.name,
            value: spec.value,
          });
        }
      }
    }

    // Если есть галерея изображений, обновляем их
    if (req.body.gallery_images !== undefined) {
      // Удаляем все старые изображения галереи
      await productModel.deleteProductGalleryImages(productId);

      // Добавляем новые изображения
      if (req.body.gallery_images.length > 0) {
        for (let i = 0; i < req.body.gallery_images.length; i++) {
          const imageUrl = req.body.gallery_images[i];
          if (imageUrl) {
            await productModel.addProductGalleryImage(
              productId,
              imageUrl,
              i === 0,
            ); // Первое изображение делаем главным
          }
        }
      }
    }

    const updatedProduct = await productModel.getProductById(productId);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Ошибка при обновлении товара" });
  }
});

// Удалить товар
router.delete("/:id", async (req: any, res: any) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "Некорректный ID товара" });
    }

    // Проверяем, существует ли товар
    const existingProduct = await productModel.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Удаляем товар
    // Спецификации удалятся автоматически благодаря каскадному удалению в БД
    await productModel.deleteProduct(productId);

    res.json({ message: "Товар успешно удален" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Ошибка при удалении товара" });
  }
});

export default router;
