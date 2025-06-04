import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "@/services/api";

interface Product {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  image_url: string | null;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{
    [categoryId: number]: Product[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1. Сначала забираем все категории
        const catResponse = await api.get<Category[]>("/categories");
        const cats = catResponse.data;
        setCategories(cats);

        // 2. Для каждой категории забираем её товары
        const productPromises = cats.map((cat) =>
          api
            .get<Product[]>(`/categories/${cat.slug}/products`)
            .then((res) => ({ id: cat.id, products: res.data }))
            .catch(() => ({ id: cat.id, products: [] as Product[] })),
        );

        const results = await Promise.all(productPromises);

        // Формируем объект { [categoryId]: [products...] }
        const byCat: { [categoryId: number]: Product[] } = {};
        results.forEach(({ id, products }) => {
          byCat[id] = products;
        });

        setProductsByCategory(byCat);
      } catch (e) {
        console.error("Ошибка при загрузке категорий и товаров:", e);
        setError("Не удалось загрузить данные. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Загрузка категорий...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {categories.map((cat) => (
        <div key={cat.id} className="border-b pb-6">
          {/* Заголовок категории */}
          <div className="flex items-center gap-4 mb-4">
            {cat.image_url && (
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-gray-600 text-sm">{cat.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productsByCategory[cat.id]?.length ? (
              productsByCategory[cat.id]!.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={
                        prod.image_url ||
                        "https://via.placeholder.com/300x300?text=Нет+изображения"
                      }
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-gray-900 font-medium text-sm md:text-base line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="text-gray-700 text-sm mt-1">
                      {prod.price} ₽/м²
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                Товаров нет
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesPage;
