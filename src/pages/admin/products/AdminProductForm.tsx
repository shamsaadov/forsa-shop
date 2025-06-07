import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from "@/components/admin/AdminLayout";
import FileUpload from "@/components/ui/file-upload";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/types";
import { ProductSpecification } from "@/types/product.ts";

interface FormData {
  id: string;
  name: string;
  description: string;
  price: number;
  price_type: "square_meter" | "linear_meter" | "piece";
  image_url: string;
  slug: string;
  stock: number;
  category_ids: string[];
  specifications: ProductSpecification[];
  gallery_images: string[];
  is_featured: boolean;
}

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    description: "",
    price: 0,
    price_type: "square_meter",
    image_url: "",
    slug: "",
    stock: 0,
    category_ids: [],
    specifications: [],
    gallery_images: [],
    is_featured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий и данных товара для редактирования
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Получаем список категорий
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Если режим редактирования, загружаем данные товара
        if (isEditMode && id) {
          const productData = await getProductById(id);

          const filledCategoryIds: string[] =
            Array.isArray(productData.category_ids) &&
            productData.category_ids.length > 0
              ? productData.category_ids.map((cid: number) => String(cid))
              : productData.category_id != null
                ? [String(productData.category_id)]
                : [];

          setFormData({
            id: productData.id,
            name: productData.name,
            description: productData.description || "",
            price: productData.price,
            price_type: productData.price_type,
            image_url: productData.image_url || "",
            slug: productData.slug,
            stock: productData.stock,
            category_ids: filledCategoryIds,
            specifications: productData.specifications || [],
            gallery_images: productData.gallery_images
              ? productData.gallery_images.map((img: any) => img.image_url)
              : [],
            is_featured: Boolean(productData.is_featured),
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Обработчик изменения текстовых полей формы
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    } else if (name === "price" || name === "stock") {
      // Для числовых полей
      const numValue = value === "" ? 0 : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
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

  // Обработчик изменения чекбоксов категорий
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        // Добавляем категорию
        return {
          ...prev,
          category_ids: [...prev.category_ids, categoryId],
        };
      } else {
        // Удаляем категорию
        return {
          ...prev,
          category_ids: prev.category_ids.filter((id) => id !== categoryId),
        };
      }
    });
  };

  // Обработчик изменения спецификаций
  const handleSpecificationChange = (
    index: number,
    field: "name" | "value",
    value: string,
  ) => {
    setFormData((prev) => {
      const newSpecifications = [...prev.specifications];
      newSpecifications[index] = {
        ...newSpecifications[index],
        [field]: value,
      };
      return {
        ...prev,
        specifications: newSpecifications,
      };
    });
  };

  // Добавление новой спецификации
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { id: Date.now(), product_id: Number(id) || 0, name: "", value: "" },
      ],
    }));
  };

  // Удаление спецификации
  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Обработчик загрузки изображения
  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: url,
    }));
  };

  // Обработчик загрузки изображений в галерею
  const handleGalleryImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, url],
    }));
  };

  // Удаление изображения из галереи
  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  // Перемещение изображения в галерее
  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const newGalleryImages = [...prev.gallery_images];
      const [removed] = newGalleryImages.splice(fromIndex, 1);
      newGalleryImages.splice(toIndex, 0, removed);
      return {
        ...prev,
        gallery_images: newGalleryImages,
      };
    });
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
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название товара обязательно";
    }

    if (formData.price <= 0) {
      newErrors.price = "Цена должна быть больше нуля";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "URL-адрес обязателен";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "URL-адрес может содержать только строчные буквы, цифры и дефисы";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Количество не может быть отрицательным";
    }

    if (formData.category_ids.length === 0) {
      newErrors.category_ids = "Выберите хотя бы одну категорию";
    }

    // Проверка на заполненность спецификаций
    if (
      formData.specifications.some(
        (spec) => !spec.name.trim() || !spec.value.trim(),
      )
    ) {
      newErrors.specifications = "Все поля характеристик должны быть заполнены";
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

      if (isEditMode && id) {
        // Обновление существующего товара
        await updateProduct(formData.id, formData);
      } else {
        // Создание нового товара
        await createProduct(formData);
      }

      // Перенаправление на страницу со списком товаров
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Ошибка при сохранении товара. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(formData);

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к товарам
        </Link>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Редактирование товара" : "Новый товар"}
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
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Название товара */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Название товара *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Например, Матовый потолок белый"
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
                      placeholder="Описание товара"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Цена */}
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Цена (руб.) *
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={errors.price ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Тип цены */}
                  <div>
                    <label
                      htmlFor="price_type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Тип цены *
                    </label>
                    <select
                      id="price_type"
                      name="price_type"
                      value={formData.price_type}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${
                        errors.price_type ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      disabled={isSubmitting}
                    >
                      <option value="square_meter">За квадратный метр</option>
                      <option value="linear_meter">За погонный метр</option>
                      <option value="piece">За штуку</option>
                    </select>
                    {errors.price_type && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.price_type}
                      </p>
                    )}
                  </div>

                  {/* Количество на складе */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Количество на складе
                    </label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className={errors.stock ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_featured: checked as boolean,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-sm font-medium text-gray-700"
                    >
                      Товар недели
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Товар будет отображаться в слайдере на главной странице
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Изображение товара */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Основное изображение товара
                    </label>
                    <FileUpload
                      onUploadComplete={handleImageUpload}
                      currentImage={formData.image_url}
                      uploadType="product"
                    />
                  </div>

                  {/* Галерея изображений */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Галерея изображений
                    </label>
                    <div className="space-y-3">
                      {/* Загрузка нового изображения */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                        <FileUpload
                          onUploadComplete={handleGalleryImageUpload}
                          uploadType="product"
                          className="w-full"
                        />
                      </div>

                      {/* Список загруженных изображений */}
                      {formData.gallery_images.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Загруженные изображения (
                            {formData.gallery_images.length})
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.gallery_images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={imageUrl}
                                  alt={`Галерея ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
                                    disabled={isSubmitting}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            Первое изображение будет использоваться как основное
                            в галерее
                          </p>
                        </div>
                      )}
                    </div>
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
                      placeholder="matovyj-potolok-belyj"
                      className={errors.slug ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.slug ? (
                      <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        Используется в URL: /products/
                        {formData.slug || "example"}
                      </p>
                    )}
                  </div>

                  {/* Категории */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категории *
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {categories.length === 0 ? (
                        <p className="text-gray-500">Нет доступных категорий</p>
                      ) : (
                        categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={formData.category_ids.includes(
                                category.id,
                              )}
                              onCheckedChange={(checked) =>
                                handleCategoryChange(
                                  category.id,
                                  checked as boolean,
                                )
                              }
                              disabled={isSubmitting}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {errors.category_ids && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category_ids}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Характеристики товара */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Характеристики товара
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecification}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить характеристику
                  </Button>
                </div>

                {formData.specifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 border border-dashed border-gray-200 rounded-md">
                    У товара пока нет характеристик. Добавьте их, нажав на
                    кнопку выше.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.specifications.map((spec, index) => (
                      <div
                        key={spec.id || index}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-1">
                          <Input
                            placeholder="Название (например, Материал)"
                            value={spec.name}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Значение (например, ПВХ пленка)"
                            value={spec.value}
                            onChange={(e) =>
                              handleSpecificationChange(
                                index,
                                "value",
                                e.target.value,
                              )
                            }
                            disabled={isSubmitting}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpecification(index)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.specifications && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.specifications}
                  </p>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4">
                <Link to="/admin/products">
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

export default AdminProductForm;
