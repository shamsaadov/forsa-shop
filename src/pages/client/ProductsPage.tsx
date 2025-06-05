import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Loader2,
  Grid,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Star,
} from "lucide-react";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  image_url: string | null;
  category_id: number;
  category_name?: string;
  is_featured: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
}

type SortOption = "name_asc" | "name_desc" | "price_asc" | "price_desc";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для фильтрации и поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [showFilters, setShowFilters] = useState(false);

  // Загружаем продукты и категории
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Загружаем продукты и категории параллельно
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        // Обогащаем продукты информацией о категориях
        const productsWithCategories = productsResponse.data.map(
          (product: Product) => {
            const category = categoriesResponse.data.find(
              (cat: Category) => cat.id === product.category_id,
            );
            return {
              ...product,
              category_name: category?.name || "Без категории",
            };
          },
        );

        setProducts(productsWithCategories);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фильтрация и сортировка продуктов
  useEffect(() => {
    let filtered = [...products];

    // Поиск по названию и описанию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query)) ||
          (product.category_name &&
            product.category_name.toLowerCase().includes(query)),
      );
    }

    // Фильтрация по категории
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategory,
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy("name_asc");
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy === option) {
      return option.includes("asc") ? (
        <SortAsc className="h-4 w-4" />
      ) : (
        <SortDesc className="h-4 w-4" />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Загрузка товаров...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок страницы */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Все товары</h1>
        <p className="text-gray-600">
          Найдено {filteredProducts.length} товаров из {products.length}
        </p>
      </div>

      {/* Панель поиска и фильтров */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        {/* Поиск */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Поиск по названию, описанию или категории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Фильтры и сортировка */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Фильтры
            {selectedCategory !== null && (
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            )}
          </button>

          {/* Сортировка */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy("name_asc")}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                sortBy === "name_asc"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Название А-Я
              {getSortIcon("name_asc")}
            </button>
            <button
              onClick={() => setSortBy("name_desc")}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                sortBy === "name_desc"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Название Я-А
              {getSortIcon("name_desc")}
            </button>
            <button
              onClick={() => setSortBy("price_asc")}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                sortBy === "price_asc"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Цена ↑{getSortIcon("price_asc")}
            </button>
            <button
              onClick={() => setSortBy("price_desc")}
              className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                sortBy === "price_desc"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Цена ↓{getSortIcon("price_desc")}
            </button>
          </div>

          {/* Кнопка очистки фильтров */}
          {(searchQuery ||
            selectedCategory !== null ||
            sortBy !== "name_asc") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
              Очистить
            </button>
          )}
        </div>

        {/* Развернутые фильтры */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Категории</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                  selectedCategory === null
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Все категории
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Активные фильтры */}
        {(searchQuery || selectedCategory !== null) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Активные фильтры:
            </h4>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Поиск: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Категория:{" "}
                  {categories.find((cat) => cat.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 hover:text-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Товары */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Товары не найдены
          </h2>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== null
              ? "Попробуйте изменить параметры поиска или фильтрации"
              : "В каталоге пока нет товаров"}
          </p>
          {(searchQuery || selectedCategory !== null) && (
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Grid className="h-5 w-5 mr-2" />
              Товары ({filteredProducts.length})
            </h2>
          </div>

          {/* Сетка товаров */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/300x300?text=Натяжной+потолок"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category_name}
                    </Badge>
                    {product.is_featured && (
                      <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Товар недели
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="font-semibold text-lg text-gray-900">
                    {product.price} ₽/м²
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
