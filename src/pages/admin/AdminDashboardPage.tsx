import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, ShoppingBag, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Product, Category } from "@/types";
import api from "@/services/api.ts";

const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getOrders = async () => {
    const response = await api.get(`/admin/orders`);
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Получаем данные о товарах и категориях
        const [productsData, categoriesData, ordersData] = await Promise.all([
          getProducts(),
          getCategories(),
          getOrders(),
        ]);

        setOrders(ordersData);
        setProducts(productsData);
        setCategories(categoriesData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Статистические данные
  const stats = [
    {
      title: "Всего товаров",
      value: products.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      path: "/admin/products",
    },
    {
      title: "Категории",
      value: categories.length,
      icon: FolderTree,
      color: "bg-green-50 text-green-600",
      path: "/admin/categories",
    },
    {
      title: "Заказы",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-yellow-50 text-yellow-600",
      path: "/admin/orders",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-gray-600 mt-1">
          Добро пожаловать в админ-панель Forsa Shop
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2 ml-2"
          >
            Попробовать снова
          </Button>
        </div>
      ) : (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <span className={`p-2 rounded-md mr-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </span>
                    {stat.title}
                  </CardTitle>
                  <CardDescription>Общее количество</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
                <CardFooter>
                  <Link to={stat.path} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      Посмотреть
                      <Eye className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Недавние товары */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Недавние товары</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Запас
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={product.image_url || "/no_photo.png"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Intl.NumberFormat("ru-RU", {
                              style: "currency",
                              currency: "RUB",
                              minimumFractionDigits: 0,
                            }).format(product.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/admin/products/edit/${product.slug}`}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Редактировать
                          </Link>
                          <Link
                            to={`/products/${product.slug}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Просмотр
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link to="/admin/products">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Все товары →
                </Button>
              </Link>
            </div>
          </div>

          {/* Категории */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Категории</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.slice(0, 3).map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {category.description || "Без описания"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link
                      to={`/admin/categories/edit/${category.id}`}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        Редактировать
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link to="/admin/categories">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Все категории →
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
