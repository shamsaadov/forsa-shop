import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Eye, Search, Star, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { getProducts, deleteProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Product, Category } from "@/types";

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const featuredCount = products.filter((p) => p.is_featured).length;

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Получение списка товаров и категорий
  // Получение списка товаров и категорий
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      // Нормализуем продукты: поле `categories` всегда будет массивом чисел
      const normalizedProducts: Product[] = productsData.map((p: any) => ({
        ...p,
        categories:
          Array.isArray(p.category_ids) && p.category_ids.length > 0
            ? p.category_ids
            : p.category_id != null
              ? [p.category_id]
              : [],
      }));

      setProducts(normalizedProducts);
      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Обработчик поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик фильтра по категории
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Фильтрация товаров по поисковому запросу и категории
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "" ||
      //  @ts-ignore
      product?.categories.some((catId) => String(catId) === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Диалог подтверждения удаления
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Обработчик удаления товара
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);

      // Обновляем список товаров
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id),
      );

      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Ошибка при удалении товара");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-gray-600 mt-1">Управляйте товарами в магазине</p>
        </div>
        <Link to="/admin/products/create">
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
            <Plus className="h-5 w-5 mr-1" />
            Добавить товар
          </Button>
        </Link>
      </div>

      {/* ─── Блок с базовой статистикой ─── */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="bg-blue-100 p-2 rounded-full">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Всего товаров</p>
            <p className="text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Товары недели</p>
            <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
          </div>
        </div>
      </div>
      {/* ───────────────────────────────────── */}

      {/* Поиск и фильтрация */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Список товаров */}
      {loading ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="animate-pulse p-4">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex py-3 space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
          <Button
            onClick={() => fetchData()}
            variant="outline"
            className="mt-2 ml-2"
          >
            Попробовать снова
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          {searchTerm || selectedCategory ? (
            <p className="text-gray-600">
              По заданным параметрам товары не найдены
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">У вас еще нет товаров</p>
              <Link to="/admin/products/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Добавить первый товар
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Товар
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Категория
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Цена
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Запас
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={
                            product.image_url ||
                            "https://placehold.co/40x40/f0f0f0/a0a0a0?text=Forsa"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                        {product.is_featured && (
                          <div className="absolute top-0 right-0">
                            <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 text-xs p-0.5 rounded">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Нед.
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {/* Рендер категорий */}
                      {/*@ts-ignore*/}
                      {product?.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {/*@ts-ignore*/}
                          {product?.categories.map((categoryId) => {
                            const category = categories.find(
                              (c) => String(c.id) === String(categoryId),
                            );
                            return category ? (
                              <span
                                key={categoryId}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                              >
                                {category.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-500">Нет категории</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link to={`/products/${product.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/products/edit/${product.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить товар "{productToDelete?.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProductsPage;
