import express from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Маршрут для входа в систему
router.post('/login', login);

// Маршрут для регистрации
router.post('/register', register);

// Маршрут для получения данных о текущем пользователе
router.get('/me', authenticate, getCurrentUser);

export default router;
