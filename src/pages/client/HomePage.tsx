import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Tag,
} from "lucide-react";
import api from "@/services/api";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import CategorySidebar from "@/components/catalog/CategorySidebar";
import PromoSlider from "@/components/home/PromoSlider";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Загружаем категории
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        // Загружаем популярные товары
        const productsResponse = await api.get("/products?limit=8");
        setFeaturedProducts(productsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/*/!* Hero section *!/*/}
      {/*<div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">*/}
      {/*  <div className="container mx-auto px-4 py-16 md:py-24">*/}
      {/*    <div className="max-w-3xl">*/}
      {/*      <h1 className="text-4xl md:text-5xl font-bold mb-4">*/}
      {/*        Преобразите ваше пространство с натяжными потолками Forsa*/}
      {/*      </h1>*/}
      {/*      <p className="text-lg md:text-xl mb-8 text-blue-100">*/}
      {/*        Качественные и долговечные натяжные потолки для любого интерьера.*/}
      {/*        Широкий выбор материалов, цветов и фактур.*/}
      {/*      </p>*/}
      {/*      <div className="flex flex-col sm:flex-row gap-4">*/}
      {/*        <Link to="/categories">*/}
      {/*          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg">*/}
      {/*            Просмотреть каталог*/}
      {/*          </Button>*/}
      {/*        </Link>*/}
      {/*        <Link to="/about">*/}
      {/*          <Button*/}
      {/*            variant="outline"*/}
      {/*            className="bg-transparent border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg"*/}
      {/*          >*/}
      {/*            О компании*/}
      {/*          </Button>*/}
      {/*        </Link>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Slider with promotions */}
      <div className="container mx-auto px-4 py-8">
        <PromoSlider />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <CategorySidebar categories={categories} loading={loading} />
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Популярные категории
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse h-48 rounded-lg"
                  ></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    to={`/categories/${category.slug}`}
                    key={category.id}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                    <img
                      src={
                        category.image_url ||
                        "https://via.placeholder.com/600x400?text=Натяжные+потолки"
                      }
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="text-xl font-semibold text-white">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm mt-1 group-hover:text-white transition-colors">
                        <span>Перейти</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Популярные товары
                </h2>
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Все товары
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-100 animate-pulse h-64 rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 8).map((product) => (
                    <Link
                      to={`/products/${product.slug}`}
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="h-40 overflow-hidden">
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
                        <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category?.name || "Натяжные потолки"}
                        </p>
                        <div className="font-semibold text-gray-900">
                          {product.price} ₽ / м²
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Why choose us */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Почему выбирают Forsa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Быстрый монтаж
                  </h3>
                  <p className="text-sm text-gray-600">
                    Установка в течение 1-3 дней после замера
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Гарантия 20 лет
                  </h3>
                  <p className="text-sm text-gray-600">
                    Уверенность в качестве наших потолков
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Бесплатная замена
                  </h3>
                  <p className="text-sm text-gray-600">
                    В случае заводского брака или дефектов
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Tag className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Честные цены
                  </h3>
                  <p className="text-sm text-gray-600">
                    Без скрытых доплат и комиссий
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
