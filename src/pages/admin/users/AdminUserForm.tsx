import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/services/api";
import { User } from "@/types";

interface FormData {
  username: string;
  password: string;
  email: string;
  role: string;
}

type UserResponse = Omit<User, "password" | "token"> & { id: string };

const AdminUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    role: "user",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных пользователя для редактирования
  useEffect(() => {
    const fetchUser = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await api.get<UserResponse>(`/admin/users/${id}`);
        const userData = response.data;

        setFormData({
          username: userData.username,
          password: "", // Не загружаем пароль для редактирования
          email: userData.email || "",
          role: userData.role,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          "Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже.",
        );
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isEditMode]);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибки при изменении поля
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Обработчик изменения роли
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Имя пользователя обязательно";
    }

    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать как минимум 6 символов";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация формы
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Подготавливаем данные (исключаем пустой пароль при редактировании)
      const submitData = { ...formData };
      if (isEditMode && !submitData.password) {
        //@ts-ignore
        delete submitData.password;
      }

      if (isEditMode && id) {
        // Обновление существующего пользователя
        await api.put(`/admin/users/${id}`, submitData);
      } else {
        // Создание нового пользователя
        await api.post("/admin/users", submitData);
      }

      // Перенаправление на страницу со списком пользователей
      navigate("/admin/users");
    } catch (err: any) {
      console.error("Error saving user:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Ошибка при сохранении пользователя. Пожалуйста, попробуйте позже.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к пользователям
        </Link>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Редактирование пользователя" : "Новый пользователь"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <Card className="animate-pulse">
          <CardContent className="p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Имя пользователя */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Имя пользователя *
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Например, admin"
                  className={errors.username ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Пароль */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {isEditMode ? "Новый пароль" : "Пароль *"}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEditMode
                      ? "Оставьте пустым, чтобы не менять"
                      : "Минимум 6 символов"
                  }
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
                {isEditMode && (
                  <p className="mt-1 text-sm text-gray-500">
                    Оставьте поле пустым, если не хотите менять пароль
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Роль */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Роль пользователя *
                </label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Роли</SelectLabel>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-sm text-gray-500">
                  Администраторы имеют доступ к админ-панели и всем функциям
                  управления
                </p>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4">
                <Link to="/admin/users">
                  <Button variant="outline" disabled={isSubmitting}>
                    Отмена
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Сохранение...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminUserForm;
