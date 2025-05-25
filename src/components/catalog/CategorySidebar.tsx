import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import api from "@/services/api";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

interface CategorySidebarProps {
  categories: Category[];
  loading: boolean;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  loading,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<
    Record<number, Product[]>
  >({});
  const [productsLoading, setProductsLoading] = useState<
    Record<number, boolean>
  >({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Функция для переключения раскрытия категории
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Функция для обработки наведения на категорию
  const handleCategoryHover = async (categoryId: number) => {
    setHoveredCategory(categoryId);

    // Если у нас еще нет данных о товарах этой категории, загружаем их
    if (!categoryProducts[categoryId] && !productsLoading[categoryId]) {
      try {
        setProductsLoading((prev) => ({ ...prev, [categoryId]: true }));

        const response = await api.get(`/products/category/${categoryId}`);

        setCategoryProducts((prev) => ({
          ...prev,
          [categoryId]: response.data,
        }));

        setProductsLoading((prev) => ({ ...prev, [categoryId]: false }));
      } catch (error) {
        console.error(
          `Error loading products for category ${categoryId}:`,
          error,
        );
        setProductsLoading((prev) => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  // Сбрасываем наведенную категорию при уходе мыши
  //const handleSidebarMouseLeave = () => {
  //  setTimeout(() => {
  //    setHoveredCategory(null);
  //  }, 2000);
  //};

  // Отображение списка категорий
  const renderCategories = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse h-10 rounded"
            ></div>
          ))}
        </div>
      );
    }

    if (categories.length === 0) {
      return <p className="text-gray-500">Категории не найдены</p>;
    }

    return (
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id} className="relative">
            <div
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                hoveredCategory === category.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onMouseEnter={() => handleCategoryHover(category.id)}
            >
              <Link
                to={`/categories/${category.slug}`}
                className="flex-grow font-medium text-gray-700 hover:text-blue-600"
              >
                {category.name}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleCategory(category.id);
                }}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                {expandedCategories[category.id] ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            {/* Выпадающее меню при наведении */}
            {hoveredCategory === category.id && (
              <div
                className="absolute left-full top-0 ml-2 z-30 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-100"
                style={{ display: window.innerWidth < 768 ? "none" : "block" }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <h3 className="font-semibold text-gray-900 border-b pb-2 mb-3">
                  {category.name}
                </h3>

                {productsLoading[category.id] ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-100 animate-pulse h-10 rounded"
                      ></div>
                    ))}
                  </div>
                ) : categoryProducts[category.id]?.length ? (
                  <ul className="space-y-2">
                    {categoryProducts[category.id].map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.slug}`}
                          className="flex items-center space-x-2 hover:bg-gray-50 rounded p-1"
                        >
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span className="text-sm text-gray-700 hover:text-blue-600">
                            {product.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2 border-t">
                      <Link
                        to={`/categories/${category.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Все товары категории
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Нет доступных товаров</p>
                )}
              </div>
            )}

            {/* Развернутая категория для мобильной версии */}
            {expandedCategories[category.id] && (
              <div className="pl-4 mt-1 border-l-2 border-gray-100">
                {productsLoading[category.id] ? (
                  <div className="space-y-2 py-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-100 animate-pulse h-6 rounded"
                      ></div>
                    ))}
                  </div>
                ) : categoryProducts[category.id]?.length ? (
                  <ul className="space-y-1 py-1">
                    {categoryProducts[category.id].map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.slug}`}
                          className="block text-sm py-1 px-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to={`/categories/${category.slug}`}
                        className="block text-sm py-1 px-2 text-blue-600 hover:text-blue-800"
                      >
                        Все товары категории
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 py-2 px-2">
                    Нет доступных товаров
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Категории</h2>

        {/* Кнопка для мобильной версии */}
        <button
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={`md:block ${mobileSidebarOpen ? "block" : "hidden"}`}>
        {renderCategories()}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          to="/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Все категории
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CategorySidebar;
