import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Package, Grid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

interface SearchResult {
  type: "product" | "category";
  id: number;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  image_url?: string;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Поиск товаров
        const productsResponse = await api.get(
          `/products?search=${encodeURIComponent(query)}&limit=20`
        );
        const products = productsResponse.data.map((product: any) => ({
          type: "product" as const,
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
        }));

        // Поиск категорий
        const categoriesResponse = await api.get(
          `/categories?search=${encodeURIComponent(query)}&limit=10`
        );
        const categories = categoriesResponse.data.map((category: any) => ({
          type: "category" as const,
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.image_url,
        }));

        setResults([...products, ...categories]);
      } catch (err) {
        console.error("Search error:", err);
        setError("Произошла ошибка при поиске. Попробуйте еще раз.");
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const productResults = results.filter((r) => r.type === "product");
  const categoryResults = results.filter((r) => r.type === "category");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок и навигация */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          На главную
        </Link>

        <div className="flex items-center mb-4">
          <Search className="h-6 w-6 text-gray-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Результаты поиска
            {query && (
              <span className="text-gray-600 font-normal"> для "{query}"</span>
            )}
          </h1>
        </div>

        {!query && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Введите поисковый запрос для получения результатов.
            </p>
          </div>
        )}
      </div>

      {/* Состояние загрузки */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Поиск...</span>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Результаты */}
      {!loading && !error && query && (
        <>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ничего не найдено
              </h2>
              <p className="text-gray-600 mb-6">
                По вашему запросу "{query}" ничего не найдено. Попробуйте
                изменить поисковый запрос.
              </p>
              <Link to="/categories">
                <Button>Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Статистика */}
              <div className="text-gray-600">
                Найдено: {productResults.length} товаров,{" "}
                {categoryResults.length} категорий
              </div>

              {/* Категории */}
              {categoryResults.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Grid className="h-5 w-5 mr-2" />
                    Категории ({categoryResults.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryResults.map((category) => (
                      <Link
                        key={`category-${category.id}`}
                        to={`/categories/${category.slug}`}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="h-32 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Grid className="h-8 w-8 text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Товары */}
              {productResults.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Товары ({productResults.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productResults.map((product) => (
                      <Link
                        key={`product-${product.id}`}
                        to={`/products/${product.slug}`}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={product.image_url || "/no_photo.png"}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          {product.price && (
                            <div className="font-semibold text-gray-900">
                              {product.price} ₽/м²
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
