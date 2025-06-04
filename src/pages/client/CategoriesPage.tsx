import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Loader2, Grid } from "lucide-react";
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
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  //const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      //if (!slug) {
      //  setLoading(false); // важный сброс, чтобы не висел спиннер
      //  return;
      //}

      try {
        setLoading(true);

        // Получаем информацию о категории
        const categoryResponse = await api.get(`/categories`);
        setCategory(categoryResponse.data);

        // Получаем товары категории
        const productsResponse = await api.get(
          `/categories/${categoryResponse.data.id}/products`,
        );
        //setProducts(productsResponse.data);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(
          "Не удалось загрузить категорию. Пожалуйста, попробуйте позже.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Загрузка категории...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Навигация */}
      <div className="mb-6">
        <Link
          to="/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к категориям
        </Link>

        {/* Заголовок категории */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {category?.image_url && (
            <div className="hidden md:block flex-shrink-0">
              <img
                src={category?.image_url}
                alt={category?.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-gray-600">{category?.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Товары */}
      {/*{products.length === 0 ? (*/}
      {/*  <div className="text-center py-12">*/}
      {/*    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />*/}
      {/*    <h2 className="text-xl font-semibold text-gray-900 mb-2">*/}
      {/*      Товары не найдены*/}
      {/*    </h2>*/}
      {/*    <p className="text-gray-600 mb-6">*/}
      {/*      В данной категории пока нет товаров*/}
      {/*    </p>*/}
      {/*    <Link to="/categories">*/}
      {/*      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">*/}
      {/*        Посмотреть другие категории*/}
      {/*      </button>*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <>*/}
      {/*    <div className="flex items-center justify-between mb-6">*/}
      {/*      <h2 className="text-xl font-semibold text-gray-900 flex items-center">*/}
      {/*        <Grid className="h-5 w-5 mr-2" />*/}
      {/*        Товары ({products.length})*/}
      {/*      </h2>*/}
      {/*    </div>*/}

      {/*    /!* Сетка товаров *!/*/}
      {/*    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">*/}
      {/*      {products.map((product) => (*/}
      {/*        <Link*/}
      {/*          key={product.id}*/}
      {/*          to={`/products/${product.slug}`}*/}
      {/*          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"*/}
      {/*        >*/}
      {/*          <div className="h-32 md:h-48 overflow-hidden">*/}
      {/*            <img*/}
      {/*              src={*/}
      {/*                product.image_url ||*/}
      {/*                "https://via.placeholder.com/300x300?text=Натяжной+потолок"*/}
      {/*              }*/}
      {/*              alt={product.name}*/}
      {/*              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"*/}
      {/*            />*/}
      {/*          </div>*/}
      {/*          <div className="p-2 md:p-4">*/}
      {/*            <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors text-sm md:text-base line-clamp-2">*/}
      {/*              {product.name}*/}
      {/*            </h3>*/}
      {/*            {product.description && (*/}
      {/*              <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2 line-clamp-1 md:line-clamp-2 hidden md:block">*/}
      {/*                {product.description}*/}
      {/*              </p>*/}
      {/*            )}*/}
      {/*            <div className="font-semibold text-gray-900 text-sm md:text-base">*/}
      {/*              {product.price} ₽/м²*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </Link>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}
    </div>
  );
};

export default CategoriesPage;
