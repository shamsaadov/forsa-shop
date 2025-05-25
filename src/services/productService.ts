import api from "./api";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  slug: string;
  stock: number;
  category_ids: string[];
  specifications?: any;
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
  const response = await api.post("/products", productData);
  return response.data;
};

// Обновить существующий товар
export const updateProduct = async (
  slug: string,
  productData: ProductFormData,
) => {
  const response = await api.put(`/products/${slug}`, productData);
  return response.data;
};

// Удалить товар
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
