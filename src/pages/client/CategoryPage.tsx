import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug } from "@/services/categoryService.ts";
import { getProductsByCategory } from "@/services/productService.ts";
import { Category, Product } from "@/types";
import ProductCard from "@/components/products/ProductCard.tsx";
import { Button } from "@/components/ui/button.tsx";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        // Получаем информацию о категории
        const categoryData = await getCategoryBySlug(slug);
        setCategory(categoryData);

        // Получаем товары в этой категории
        const productsData = await getProductsByCategory(categoryData.id);
        setProducts(productsData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(
          "Не удалось загрузить данные категории. Пожалуйста, попробуйте позже.",
        );
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  // Если slug не определен, показываем сообщение об ошибке
  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-red-500 mb-4">
          <p>Категория не найдена</p>
        </div>
        <Link to="/categories">
          <Button>Вернуться к категориям</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Все категории
        </Link>

        {loading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3"></div>
        ) : error ? (
          <h1 className="text-3xl font-bold text-red-500">Ошибка загрузки</h1>
        ) : category ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 max-w-3xl">{category.description}</p>
            )}
          </>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">
            Категория не найдена
          </h1>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow bg-white"
            >
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p>В данной категории пока нет товаров</p>
          <Link to="/products" className="mt-4 inline-block">
            <Button>Посмотреть все товары</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
