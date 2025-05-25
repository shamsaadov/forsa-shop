import { RowDataPacket, ResultSetHeader, OkPacket } from "mysql2";
import pool from "../config/db";

export interface Category extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const categoryModel = {
  // Получить все категории
  async getAllCategories(): Promise<Category[]> {
    const [rows] = await pool.query<Category[]>(
      "SELECT * FROM categories ORDER BY name",
    );
    return rows;
  },

  // Получить категорию по ID
  async getCategoryById(id: number | string): Promise<Category | null> {
    const [rows] = await pool.query<Category[]>(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );

    return rows.length > 0 ? rows[0] : null;
  },

  // Получить категорию по slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const [rows] = await pool.query<Category[]>(
      "SELECT * FROM categories WHERE slug = ?",
      [slug],
    );

    return rows.length > 0 ? rows[0] : null;
  },

  // Создать новую категорию
  async createCategory(categoryData: {
    name: string;
    description: string | null;
    slug: string;
    image_url: string | null;
  }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO categories (name, description, slug, image_url) VALUES (?, ?, ?, ?)",
      [
        categoryData.name,
        categoryData.description,
        categoryData.slug,
        categoryData.image_url,
      ],
    );

    return result.insertId;
  },

  // Обновить категорию
  async updateCategory(
    id: number | string,
    categoryData: {
      name?: string;
      description?: string | null;
      slug?: string;
      image_url?: string | null;
    },
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(categoryData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    const [result] = await pool.query<OkPacket>(
      `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  },

  // Удалить категорию
  async deleteCategory(id: number | string): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM categories WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  },
};

export default categoryModel;
