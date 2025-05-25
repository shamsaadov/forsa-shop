import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/services/authService';
import { getToken } from '@/utils/tokenUtils';
import { LoginCredentials, User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();

      if (token) {
        try {
          const userData = await getCurrentUser();
          // Создаем объект пользователя с минимальными данными
          setUser({
            id: userData.id,
            username: 'user', // Полное имя пользователя здесь не доступно
            email: null,
            role: userData.role,
            token
          });
        } catch (err) {
          console.error('Failed to verify token:', err);
          setError('Ошибка проверки авторизации. Пожалуйста, войдите снова.');
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    verifyToken();
  }, []);

  // Функция очистки ошибок
  const clearError = () => {
    setError(null);
  };

  // Функция авторизации
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await loginApi(credentials);
      setUser(userData);
    } catch (err: any) {
      console.error('Login failed:', err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка авторизации. Проверьте имя пользователя и пароль.');
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
