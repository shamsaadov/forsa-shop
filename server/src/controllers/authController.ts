import { Request, Response } from 'express';
import { getUserByUsername, createUser } from '../models/user';
import { comparePassword, generateToken } from '../utils/auth';

// Контроллер для входа в систему
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Проверяем, что все необходимые поля заполнены
    if (!username || !password) {
      res.status(400).json({ message: 'Необходимо указать имя пользователя и пароль' });
      return;
    }

    // Ищем пользователя в базе данных
    const user = await getUserByUsername(username);
    if (!user) {
      res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      return;
    }

    // Проверяем пароль
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      return;
    }

    // Генерируем JWT токен
    const token = generateToken(user.id, user.role);

    // Возвращаем данные пользователя и токен
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе в систему' });
  }
};

// Контроллер для регистрации нового пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body;

    // Проверяем, что все необходимые поля заполнены
    if (!username || !password) {
      res.status(400).json({ message: 'Необходимо указать имя пользователя и пароль' });
      return;
    }

    // Проверяем, существует ли пользователь с таким именем
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      return;
    }

    // Создаем нового пользователя
    const newUser = await createUser({
      username,
      password,
      email,
      role: 'admin'
    });

    // Генерируем JWT токен
    const token = generateToken(newUser.id, newUser.role);

    // Возвращаем данные пользователя и токен
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации', error });
  }
};

// Получить данные о текущем пользователе
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user устанавливается в middleware authenticate
    if (!req.user) {
      res.status(401).json({ message: 'Не аутентифицирован' });
      return;
    }

    res.json({
      id: req.user.id,
      role: req.user.role
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
};
