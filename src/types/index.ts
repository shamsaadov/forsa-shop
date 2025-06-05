// Тип категории
export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

// Тип товара
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  slug: string;
  stock: number;
  created_at: string;
  updated_at: string;
  categories?: string[];
  is_featured?: boolean;
}

// Тип элемента корзины
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Тип пользователя
export interface User {
  id: string;
  username: string;
  email: string | null;
  role: string;
  token: string;
}

// Тип для аутентификации
export interface AuthResponse {
  id: string;
  username: string;
  email: string | null;
  role: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
