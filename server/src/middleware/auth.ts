import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

// Расширяем интерфейс Request для добавления пользовательской информации
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware для проверки токена и аутентификации
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Обработка CORS preflight запросов
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;

    // Если токена нет, возвращаем ошибку
    if (!authHeader) {
      res.status(401).json({ message: 'Отсутствует токен аутентификации' });
      return;
    }

    // Извлекаем токен из Bearer или берем как есть если нет префикса
    let token = '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader; // Если токен передается без префикса Bearer
    }

    // Проверка токена на пустоту
    if (!token || token === 'undefined' || token === 'null') {
      res.status(401).json({ message: 'Некорректный токен аутентификации' });
      return;
    }

    // Проверяем токен
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Недействительный токен' });
      return;
    }

    // Добавляем информацию о пользователе в запрос
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(401).json({ message: 'Ошибка аутентификации', error: String(error) });
  }
};

// Middleware для проверки роли администратора
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Проверяем, что пользователь аутентифицирован
  if (!req.user) {
    res.status(401).json({ message: 'Не аутентифицирован' });
    return;
  }

  // Проверяем, что пользователь имеет роль admin
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Доступ запрещен, требуются права администратора' });
    return;
  }

  next();
};
