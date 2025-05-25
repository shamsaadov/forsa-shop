import React, { useState, useEffect } from "react";
import { getCategories } from "@/services/categoryService.ts";
import { Category } from "@/types";
import CategoryCard from "@/components/categories/CategoryCard.tsx";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          "Не удалось загрузить категории. Пожалуйста, попробуйте позже.",
        );
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Категории натяжных потолков</h1>
        <p className="text-gray-600">
          Выберите категорию, чтобы увидеть все доступные варианты натяжных
          потолков
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка категорий...</p>
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
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          Категории не найдены
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
