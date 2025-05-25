import React, { useState, useEffect } from "react";
import { getProducts } from "@/services/productService.ts";
import { getCategories } from "@/services/categoryService.ts";
import { Product, Category } from "@/types";
import ProductCard from "@/components/products/ProductCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Search, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для фильтрации
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Получение товаров и категорий
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);

        // Установка максимальной цены для фильтра
        if (productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map((p: any) => p.price));
          setPriceRange({ min: 0, max: maxPrice });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Применение фильтров
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Фильтр по поисковому запросу
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower)),
      );
    }

    // Фильтр по категории
    if (selectedCategory) {
      result = result.filter((product) =>
        product.categories?.includes(selectedCategory),
      );
    }

    // Фильтр по цене
    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max,
    );

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, products]);

  // Обработчик для изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик для изменения выбранной категории
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory((prevSelected) =>
      prevSelected === categoryId ? "" : categoryId,
    );
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: Math.max(...products.map((p) => p.price)) });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Каталог натяжных потолков</h1>
        <p className="text-gray-600">
          Выберите подходящий вариант натяжного потолка для вашего интерьера
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:w-auto w-full">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
              <SheetDescription>
                Выберите параметры для фильтрации товаров
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Категории</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Цена</h3>
                <div className="space-y-4">
                  <div className="flex justify-between space-x-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        От
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        До
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full"
              >
                Сбросить фильтры
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Отображение результатов */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
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
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            По вашему запросу товары не найдены
          </p>
          <Button onClick={resetFilters}>Сбросить фильтры</Button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Найдено товаров: {filteredProducts.length}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
