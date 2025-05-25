import api from './api';
import { AuthResponse, LoginCredentials, User } from '@/types';
import { saveToken, removeToken } from '@/utils/tokenUtils';

// Авторизация пользователя
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Сохраняем токен в localStorage
    if (response.data.token) {
      saveToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

// Регистрация пользователя
export const register = async (
  data: LoginCredentials & { email?: string }
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);

    // Сохраняем токен в localStorage
    if (response.data.token) {
      saveToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
};

// Получить текущего пользователя
export const getCurrentUser = async (): Promise<{ id: string; role: string }> => {
  try {
    const response = await api.get<{ id: string; role: string }>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user API error:', error);
    throw error;
  }
};

// Выход из системы
export const logout = (): void => {
  removeToken();
};
