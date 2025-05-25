import pool from "../config/db";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/auth";

export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  username: string;
  password: string;
  email?: string;
  role?: string;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  email?: string;
  role?: string;
}

// Получить всех пользователей
export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query("SELECT * FROM users ORDER BY username");
  return rows as User[];
};

// Получить пользователя по ID
export const getUserById = async (id: string): Promise<User | null> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

// Получить пользователя по имени пользователя
export const getUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
};

// Создать пользователя
export const createUser = async (data: CreateUserInput): Promise<User> => {
  const { username, password, email, role } = data;
  const id = uuidv4();
  const hashedPassword = await hashPassword(password);

  await pool.query(
    "INSERT INTO users (id, username, password, email, role) VALUES (?, ?, ?, ?, ?)",
    [id, username, hashedPassword, email || null, role || "user"],
  );

  return {
    id,
    username,
    password: hashedPassword,
    email: email || null,
    role: role || "user",
    created_at: new Date(),
    updated_at: new Date(),
  };
};

// Обновить пользователя
export const updateUser = async (
  id: string,
  data: UpdateUserInput,
): Promise<User | null> => {
  // Получаем текущие данные пользователя
  const user = await getUserById(id);
  if (!user) return null;

  // Обновляем данные
  const { username, password, email, role } = data;
  const updatedUsername = username || user.username;
  const updatedEmail = email !== undefined ? email : user.email;
  const updatedRole = role || user.role;

  // Если передан новый пароль, хешируем его
  let updatedPassword = user.password;
  if (password) {
    updatedPassword = await hashPassword(password);
  }

  await pool.query(
    `UPDATE users
     SET username = ?, password = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [updatedUsername, updatedPassword, updatedEmail, updatedRole, id],
  );

  return {
    ...user,
    username: updatedUsername,
    password: updatedPassword,
    email: updatedEmail,
    role: updatedRole,
    updated_at: new Date(),
  };
};

// Удалить пользователя
export const deleteUser = async (id: string): Promise<boolean> => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  // @ts-ignore - MySQL2 типы
  return result.affectedRows > 0;
};
