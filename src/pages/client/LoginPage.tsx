import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { LogIn, AlertCircle } from "lucide-react";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const {
    login,
    isAuthenticated,
    isLoading,
    error: authError,
    clearError,
  } = useAuth();
  const navigate = useNavigate();

  // Очищаем ошибки при монтировании компонента
  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Перенаправляем на админ панель, если пользователь уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Очищаем локальные ошибки
    setLocalError("");
    if (!username || !password) {
      setLocalError("Пожалуйста, введите имя пользователя и пароль");
      return;
    }
    try {
      await login({ username, password });
      // После успешного входа, useEffect перенаправит на /admin
    } catch (err) {
      // Ошибка уже будет установлена в AuthContext
      console.error("Login submission error:", err);
    }
  };

  // Если пользователь уже авторизован, не показываем страницу входа
  if (isAuthenticated && !isLoading) {
    return null; // Или можно показать сообщение о перенаправлении
  }

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Вход в систему
          </CardTitle>
          <CardDescription className="text-center">
            Войдите, чтобы получить доступ к админ-панели
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Отображаем ошибку (локальную или из контекста аутентификации) */}
            {(localError || authError) && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{localError || authError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Имя пользователя
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Вход...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Войти
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
