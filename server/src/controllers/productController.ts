import { Request, Response } from "express";
import productModel from "../models/product";

// Получить все товары
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Ошибка сервера при получении товаров" });
  }
};

// Получить товар по ID
export const getProductByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);

    if (!product) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Ошибка сервера при получении товара" });
  }
};

// Получить товар по slug
export const getProductBySlugHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await productModel.getProductBySlug(slug);

    if (!product) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ message: "Ошибка сервера при получении товара" });
  }
};

// Получить товары по категории
export const getProductsByCategoryHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
};

// Создать новый товар
export const createProductHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, price, image_url, slug, stock, category_ids } =
      req.body;

    if (!name || price === undefined) {
      res.status(400).json({ message: "Название и цена товара обязательны" });
      return;
    }

    const newProduct = await productModel.createProduct({
      name,
      description,
      price,
      image_url,
      slug,
      stock,
      category_ids,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Ошибка сервера при создании товара" });
  }
};

// Обновить товар
export const updateProductHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, slug, stock, category_ids } =
      req.body;

    const updatedProduct = await productModel.updateProduct(id, {
      name,
      description,
      price,
      image_url,
      slug,
      stock,
      category_ids,
    });

    if (!updatedProduct) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Ошибка сервера при обновлении товара" });
  }
};

// Удалить товар
export const deleteProductHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await productModel.deleteProduct(id);

    if (!result) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    res.json({ message: "Товар успешно удален" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении товара" });
  }
};
