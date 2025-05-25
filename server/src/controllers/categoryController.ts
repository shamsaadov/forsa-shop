import { Request, Response } from "express";
import categoryModel from "../models/category";

// Получить все категории
export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching cate1gories:", error);
    res.status(500).json({ message: "Ошибка сервера при получении категорий" });
  }
};

// Получить категорию по ID
export const getCategoryByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      res.status(404).json({ message: "Категория не найдена" });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ message: "Ошибка сервера при получении категории" });
  }
};

// Получить категорию по slug
export const getCategoryBySlugHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.getCategoryBySlug(slug);

    if (!category) {
      res.status(404).json({ message: "Категория не найдена" });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    res.status(500).json({ message: "Ошибка сервера при получении категории" });
  }
};

// Создать новую категорию
export const createCategoryHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description, image_url, slug } = req.body;

    if (!name) {
      res.status(400).json({ message: "Название категории обязательно" });
      return;
    }

    const newCategory = await categoryModel.createCategory({
      name,
      description,
      image_url,
      slug,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Ошибка сервера при создании категории" });
  }
};

// Обновить категорию
export const updateCategoryHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image_url, slug } = req.body;

    const updatedCategory = await categoryModel.updateCategory(id, {
      name,
      description,
      image_url,
      slug,
    });

    if (!updatedCategory) {
      res.status(404).json({ message: "Категория не найдена" });
      return;
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при обновлении категории" });
  }
};

// Удалить категорию
export const deleteCategoryHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await categoryModel.deleteCategory(id);

    if (!result) {
      res.status(404).json({ message: "Категория не найдена" });
      return;
    }

    res.json({ message: "Категория успешно удалена" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении категории" });
  }
};
