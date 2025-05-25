import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import FileUpload from "@/components/ui/file-upload";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "@/services/categoryService";
import { Category } from "@/types";

interface FormData {
  name: string;
  description: string;
  image_url: string;
  slug: string;
}

const AdminCategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image_url: "",
    slug: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных категории для редактирования
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const data = await getCategoryById(id);

        setFormData({
          name: data.name,
          description: data.description || "",
          image_url: data.image_url || "",
          slug: data.slug,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(
          "Не удалось загрузить данные категории. Пожалуйста, попробуйте позже.",
        );
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode]);

  // Обработчик изменения полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Если меняется название и слаг пустой или совпадает с автогенерированным, обновляем слаг
    if (
      name === "name" &&
      (!formData.slug || formData.slug === generateSlug(formData.name))
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Очищаем ошибки при изменении поля
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Обработчик загрузки изображения
  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  // Генерация слага из названия
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Удаляем специальные символы
      .replace(/[\s_-]+/g, "-") // Заменяем пробелы и подчеркивания на дефисы
      .replace(/^-+|-+$/g, ""); // Удаляем дефисы в начале и конце
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название категории обязательно";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL-адрес обязателен";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "URL-адрес может содержать только строчные буквы, цифры и дефисы";
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

      if (isEditMode) {
        // Обновление существующей категории
        await updateCategory(id, formData);
      } else {
        // Создание новой категории
        await createCategory(formData);
      }

      // Перенаправление на страницу со списком категорий
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error saving category:", err);
      setError(
        "Ошибка при сохранении категории. Пожалуйста, попробуйте позже.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к категориям
        </Link>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Редактирование категории" : "Новая категория"}
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
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка с основными полями */}
                <div className="space-y-4">
                  {/* Название категории */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Название категории *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Например, Матовые потолки"
                      className={errors.name ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Описание */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Описание
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Описание категории"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Слаг (URL) */}
                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      URL-адрес *
                    </label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="matovye-potolki"
                      className={errors.slug ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.slug ? (
                      <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Используется в URL: /categories/
                        {formData.slug || "example"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Правая колонка с изображением */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Изображение категории
                  </label>
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    currentImage={formData.image_url}
                    uploadType="category"
                  />
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4">
                <Link to="/admin/categories">
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

export default AdminCategoryForm;
