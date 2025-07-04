import api from "./api";
import { Product, ProductSpecification } from "@/types/product.ts";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  price_type: "square_meter" | "linear_meter" | "piece";
  image_url: string;
  slug: string;
  stock: number;
  category_ids: string[];
  specifications?: ProductSpecification[];
  gallery_images?: string[];
  is_featured?: boolean;
}

// Получить товары по заданной категории
export const getProductsByCategory = async (categoryId: string) => {
  const response = await api.get("/products", {
    params: { category_id: categoryId },
  });
  return response.data;
};

// Получить все товары
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Получить товары недели
export const getFeaturedProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await api.get(`/products/featured?limit=${limit}`);
    if (!response.data || !Array.isArray(response.data)) {
      console.error("Invalid API response format:", response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Получить товар по ID
export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

// Создать новый товар
export const createProduct = async (productData: ProductFormData) => {
  const response = await api.post("/admin/products", productData);
  return response.data;
};

// Обновить существующий товар
export const updateProduct = async (
  id: string,
  productData: ProductFormData
) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

// Удалить товар
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};
