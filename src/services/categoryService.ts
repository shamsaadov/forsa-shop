import api from './api';
import { Category } from '@/types';

// Получить все категории
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

// Получить категорию по ID
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<Category>(`/categories/id/${id}`);
  return response.data;
};

// Получить категорию по slug
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get<Category>(`/categories/slug/${slug}`);
  return response.data;
};

// Создать категорию (только для администратора)
export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const response = await api.post<Category>('/categories', data);
  return response.data;
};

// Обновить категорию (только для администратора)
export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const response = await api.put<Category>(`/categories/${id}`, data);
  return response.data;
};

// Удалить категорию (только для администратора)
export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/categories/${id}`);
  return response.data;
};
