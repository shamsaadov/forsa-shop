import express from 'express';
import {
  getCategories,
  getCategoryByIdHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from '../controllers/categoryController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Публичные маршруты (не требуют аутентификации)
router.get('/', getCategories);
router.get('/id/:id', getCategoryByIdHandler);
router.get('/slug/:slug', getCategoryBySlugHandler);

// Защищенные маршруты (требуют аутентификации и прав администратора)
router.post('/', authenticate, isAdmin, createCategoryHandler);
router.put('/:id', authenticate, isAdmin, updateCategoryHandler);
router.delete('/:id', authenticate, isAdmin, deleteCategoryHandler);

export default router;
