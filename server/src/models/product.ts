import { RowDataPacket, ResultSetHeader, OkPacket } from "mysql2";
import pool from "../config/db";
import { Category } from "./category";

export interface Product extends RowDataPacket {
  id: number | string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  image_url: string | null;
  category_id: number | string;
  category?: Category;
  created_at: string;
  updated_at: string;
  specifications?: ProductSpecification[];
  gallery_images?: ProductGalleryImage[];
}

export interface ProductSpecification extends RowDataPacket {
  id: number | string;
  product_id: number | string;
  name: string;
  value: string;
  updated_at?: string;
}

export interface ProductGalleryImage extends RowDataPacket {
  id: number | string;
  product_id: number | string;
  image_url: string;
  is_primary: boolean;
}

const productModel = {
  // Получить все товары
  async getAllProducts(
    limit: number = 100,
    offset: number = 0,
  ): Promise<Product[]> {
    const [rows] = await pool.query<Product[]>(
      "SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset],
    );
    return rows;
  },

  // Добавить изображение в галерею
  async addProductGalleryImage(
    productId: number,
    imageUrl: string,
    isPrimary: boolean,
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO product_gallery (product_id, image_url, is_primary)
     VALUES (?, ?, ?)`,
      [productId, imageUrl, isPrimary ? 1 : 0],
    );
    return result.insertId;
  },

  // Удалить все изображения из галереи товара
  async deleteProductGalleryImages(
    productId: number | string,
  ): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      `DELETE FROM product_gallery WHERE product_id = ?`,
      [productId],
    );
    return result.affectedRows > 0;
  },

  // (Опционально) Удалить одно изображение по его ID
  async deleteProductGalleryImage(imageId: number | string): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      `DELETE FROM product_gallery WHERE id = ?`,
      [imageId],
    );
    return result.affectedRows > 0;
  },

  // Поиск товаров с фильтрами
  async searchProducts(
    search?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Product[]> {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
    }

    if (categoryId) {
      query += " AND category_id = ?";
      params.push(categoryId);
    }

    if (minPrice !== undefined) {
      query += " AND price >= ?";
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query<Product[]>(query, params);
    return rows;
  },

  // Получить товар по ID
  async getProductById(id: number | string): Promise<Product | null> {
    const [rows] = await pool.query<Product[]>(
      "SELECT * FROM products WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    // Получаем информацию о категории
    if (product.category_id) {
      const [categoryRows] = await pool.query<Category[]>(
        "SELECT * FROM categories WHERE id = ?",
        [product.category_id],
      );

      if (categoryRows.length > 0) {
        product.category = categoryRows[0];
      }
    }

    // Получаем характеристики товара
    const [specifications] = await pool.query<ProductSpecification[]>(
      "SELECT * FROM product_specifications WHERE product_id = ?",
      [id],
    );

    // Получаем галерею изображений
    const [galleryImages] = await pool.query<ProductGalleryImage[]>(
      "SELECT * FROM product_gallery WHERE product_id = ? ORDER BY is_primary DESC",
      [id],
    );

    product.specifications = specifications;
    product.gallery_images = galleryImages;

    return product;
  },

  // Получить товар по slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    const [rows] = await pool.query<Product[]>(
      "SELECT * FROM products WHERE slug = ?",
      [slug],
    );

    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    // Получаем информацию о категории
    if (product.category_id) {
      const [categoryRows] = await pool.query<Category[]>(
        "SELECT * FROM categories WHERE id = ?",
        [product.category_id],
      );

      if (categoryRows.length > 0) {
        product.category = categoryRows[0];
      }
    }

    // Получаем характеристики товара
    const [specifications] = await pool.query<ProductSpecification[]>(
      "SELECT * FROM product_specifications WHERE product_id = ?",
      [product.id],
    );

    // Получаем галерею изображений
    const [galleryImages] = await pool.query<ProductGalleryImage[]>(
      "SELECT * FROM product_gallery WHERE product_id = ? ORDER BY is_primary DESC",
      [product.id],
    );

    product.specifications = specifications;
    product.gallery_images = galleryImages;

    return product;
  },

  // Получить товары по категории
  async getProductsByCategory(
    categoryId: number | string,
    limit: number = 100,
    offset: number = 0,
    excludeProductId?: number,
  ): Promise<Product[]> {
    let query = "SELECT * FROM products WHERE category_id = ?";
    const params: any[] = [categoryId];

    if (excludeProductId !== undefined) {
      query += " AND id != ?";
      params.push(excludeProductId);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query<Product[]>(query, params);
    return rows;
  },

  // Создать новый товар
  async createProduct(productData: any): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO products (name, description, slug, price, image_url, category_id, stock, category_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productData.name,
        productData.description,
        productData.slug,
        productData.price,
        productData.image_url,
        productData.category_id,
        productData.stock,
        productData.category_ids,
      ],
    );

    return result.insertId;
  },

  // Обновить товар
  async updateProduct(
    id: number | string,
    productData: {
      name?: string;
      description?: string | null;
      slug?: string;
      price?: number;
      image_url?: string | null;
      category_id?: number;
      stock?: any;
      category_ids?: any;
    },
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(productData).forEach(([key, value]) => {
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
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  },

  // Удалить товар
  async deleteProduct(id: number | string): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM products WHERE id = ?",
      [id],
    );

    return result.affectedRows > 0;
  },

  // Добавить спецификацию к товару
  async addProductSpecification(
    productId: number,
    specData: {
      name: string;
      value: string;
    },
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO product_specifications (product_id, name, value) VALUES (?, ?, ?)",
      [productId, specData.name, specData.value],
    );

    return result.insertId;
  },

  // Получить спецификации товара
  async getProductSpecifications(
    productId: number,
  ): Promise<ProductSpecification[]> {
    const [rows] = await pool.query<ProductSpecification[]>(
      "SELECT * FROM product_specifications WHERE product_id = ?",
      [productId],
    );

    return rows;
  },

  // Обновить спецификацию
  async updateProductSpecification(
    specId: number,
    specData: {
      name?: string;
      value?: string;
    },
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(specData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = NOW()");
    values.push(specId);

    const [result] = await pool.query<OkPacket>(
      `UPDATE product_specifications SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  },

  // Удалить спецификацию
  async deleteProductSpecification(specId: number): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM product_specifications WHERE id = ?",
      [specId],
    );

    return result.affectedRows > 0;
  },

  // Удалить все спецификации товара
  async deleteProductSpecifications(productId: number): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM product_specifications WHERE product_id = ?",
      [productId],
    );

    return result.affectedRows > 0;
  },
};

export default productModel;
