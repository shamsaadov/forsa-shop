import express from "express";
import productModel from "../models/product";

const router = express.Router();

// Получить все товары с возможностью поиска и фильтрации
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      limit = 100,
      offset = 0,
    } = req.query;

    const products = await productModel.searchProducts(
      search as string,
      category ? Number(category) : undefined,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      Number(limit),
      Number(offset)
    );

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Ошибка при получении товаров" });
  }
});

// Получить товары по категории
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productModel.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении товаров по категории" });
  }
});

// Получить товар по slug
router.get("/:slug", async (req: any, res: any) => {
  try {
    const product = await productModel.getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Ошибка при получении товара" });
  }
});

export default router;
