import express, { Request, Response } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../models/user";

const router = express.Router();

// Защита всех маршрутов админки
router.use(authenticate, isAdmin);

// Получить список всех пользователей
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();

    // Не возвращаем пароли
    const safeUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(safeUsers);
  } catch (error) {
    console.error("Error getting users:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении пользователей" });
  }
});

// Получить пользователя по ID
router.get("/users/:id", async (req: any, res: any) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Не возвращаем пароль
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error getting user:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении пользователя" });
  }
});

// Создать нового пользователя
router.post("/users", async (req: any, res: any) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Имя пользователя и пароль обязательны" });
    }

    const newUser = await createUser({
      username,
      password,
      email,
      role: role || "user",
    });

    // Не возвращаем пароль
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при создании пользователя" });
  }
});

// Обновить пользователя
router.put("/users/:id", async (req: any, res: any) => {
  try {
    const { username, password, email, role } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await getUserById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновляем пользователя
    const updatedUser = await updateUser(req.params.id, {
      username,
      password,
      email,
      role,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Не возвращаем пароль
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при обновлении пользователя" });
  }
});

// Удалить пользователя
router.delete("/users/:id", async (req: any, res: any) => {
  try {
    // Проверяем, не пытается ли администратор удалить себя
    if (req.user?.id === req.params.id) {
      return res
        .status(400)
        .json({ message: "Вы не можете удалить собственный аккаунт" });
    }

    const result = await deleteUser(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при удалении пользователя" });
  }
});

export default router;
