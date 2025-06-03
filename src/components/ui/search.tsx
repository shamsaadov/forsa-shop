import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Package, Grid } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
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

interface SearchProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
}

const SearchComponent: React.FC<SearchProps> = ({
  className = "",
  placeholder = "Поиск товаров и категорий...",
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Функция поиска
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      // Поиск товаров
      const productsResponse = await api.get(
        `/products?search=${encodeURIComponent(searchQuery)}&limit=5`,
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
        `/api/categories?search=${encodeURIComponent(searchQuery)}&limit=3`,
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
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced поиск
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Обработчик клика по результату
  const handleResultClick = (result: SearchResult) => {
    const path =
      result.type === "product"
        ? `/products/${result.slug}`
        : `/categories/${result.slug}`;

    navigate(path);
    setQuery("");
    setShowResults(false);
    onClose?.();
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      // Переходим к странице поиска с результатами
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setShowResults(false);
      onClose?.();
    }
  };

  // Очистка поиска
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Результаты поиска */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Поиск...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {result.type === "product" ? (
                      result.image_url ? (
                        <img
                          src={result.image_url}
                          alt={result.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )
                    ) : result.image_url ? (
                      <img
                        src={result.image_url}
                        alt={result.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <Grid className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          result.type === "product"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {result.type === "product" ? "Товар" : "Категория"}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {result.description}
                      </p>
                    )}
                    {result.price && (
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {result.price} ₽/м²
                      </p>
                    )}
                  </div>
                </button>
              ))}

              {query.trim() && (
                <div className="border-t border-gray-100 px-4 py-2">
                  <button
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(query)}`);
                      setQuery("");
                      setShowResults(false);
                      onClose?.();
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Посмотреть все результаты для "{query}"
                  </button>
                </div>
              )}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500">
              <p>Ничего не найдено</p>
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  setQuery("");
                  setShowResults(false);
                  onClose?.();
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                Попробовать расширенный поиск
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Мобильный поиск в модальном окне
interface MobileSearchProps {
  open: boolean;
  onClose: () => void;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Поиск</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SearchComponent
            placeholder="Поиск товаров и категорий..."
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchComponent;
