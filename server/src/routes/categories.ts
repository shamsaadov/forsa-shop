import express from "express";
import {
  getCategories,
  getCategoryByIdHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/categoryController";
import { authenticate, isAdmin } from "../middleware/auth";
import categoryModel from "../models/category";

const router = express.Router();

// Публичные маршруты (не требуют аутентификации)
router.get("/", getCategories);
router.get("/id/:id", getCategoryByIdHandler);
router.get("/slug/:slug", getCategoryBySlugHandler);

router.get("/", async (req, res) => {
  try {
    const { search, limit = 100, offset = 0 } = req.query;

    let categories;
    if (search) {
      categories = await categoryModel.searchCategories(
        search as string,
        Number(limit),
        Number(offset),
      );
    } else {
      categories = await categoryModel.getAllCategories();
    }

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Ошибка при получении категорий" });
  }
});

// Защищенные маршруты (требуют аутентификации и прав администратора)
router.post("/", authenticate, isAdmin, createCategoryHandler);
router.put("/:id", authenticate, isAdmin, updateCategoryHandler);
router.delete("/:id", authenticate, isAdmin, deleteCategoryHandler);

export default router;
