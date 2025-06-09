import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowRight, Star, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProducts } from "@/services/productService";
import { Product } from "@/types";

const PromoSlider: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем товары недели
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedProducts(5);
        // Проверяем, что response является массивом
        if (Array.isArray(response)) {
          setFeaturedProducts(response);
        } else {
          console.error("API response is not an array:", response);
          setError("Неверный формат данных от сервера");
          setFeaturedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Не удалось загрузить товары недели");
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fallback статические слайды, если нет товаров недели
  const fallbackSlides = [
    {
      id: "fallback-1",
      title: "Качественные натяжные потолки",
      description:
        "Профессиональная установка натяжных потолков любой сложности. Гарантия качества и доступные цены.",
      image:
        "https://images.unsplash.com/photo-1631136356070-1a07393e50cc?q=80&w=1200&auto=format&fit=crop",
      buttonText: "Посмотреть каталог",
      buttonLink: "/products",
      textColor: "text-white",
      bgColor: "bg-gradient-to-r from-blue-700/60 to-blue-900/60",
    },
    {
      id: "fallback-2",
      title: "Бесплатный замер и консультация",
      description:
        "Наши специалисты бесплатно приедут к вам, произведут замеры и дадут профессиональную консультацию.",
      image:
        "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop",
      buttonText: "Заказать замер",
      buttonLink: "/contact",
      textColor: "text-gray-900",
      bgColor: "bg-gradient-to-r from-gray-100/70 to-white/70",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] md:h-[500px] bg-gray-100 rounded-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Загрузка товаров недели...</span>
        </div>
      </div>
    );
  }

  // Используем товары недели, если есть, иначе fallback слайды
  const slides =
    Array.isArray(featuredProducts) && featuredProducts.length > 0
      ? featuredProducts
      : fallbackSlides;

  return (
    <div className="relative">
      {Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 shadow-lg">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Товары недели
          </Badge>
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={slides.length > 1}
        className="rounded-lg overflow-hidden shadow-md"
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            {"slug" in item ? (
              <div
                className="relative h-[400px] md:h-[500px] bg-center bg-cover"
                style={{
                  backgroundImage: `url(${item.image_url || "https://via.placeholder.com/1200x500?text=Натяжной+потолок"})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-lg">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                        {item.name}
                      </h2>
                      {item.description && (
                        <p className="text-lg mb-4 text-gray-100 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mb-6">
                        <span className="text-2xl md:text-3xl font-bold text-yellow-400">
                          {item.price} ₽/м²
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/products/${item.slug}`}>
                          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg flex items-center">
                            Подробнее
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Link to={`/products/${item.slug}`}>
                          <Button
                            variant="outline"
                            className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg flex items-center"
                          >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Заказать
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Fallback слайд
              <div
                className="relative h-[400px] md:h-[500px] bg-center bg-cover"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className={`absolute inset-0 ${item.bgColor}`}></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-lg">
                      <h2
                        className={`text-3xl md:text-4xl font-bold mb-3 ${item.textColor}`}
                      >
                        {item.title}
                      </h2>
                      <p
                        className={`text-lg mb-6 ${item.textColor === "text-white" ? "text-gray-100" : "text-gray-700"}`}
                      >
                        {item.description}
                      </p>
                      <Link to={item.buttonLink}>
                        <Button
                          className={`px-6 py-3 rounded-lg flex items-center ${
                            item.textColor === "text-white"
                              ? "bg-white text-blue-600 hover:bg-gray-100"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {item.buttonText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Стили для навигации и пагинации Swiper */}
      <style>{`
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.swiper-button-next:after),
        :global(.swiper-button-prev:after) {
          font-size: 18px;
        }

        :global(.swiper-pagination-bullet) {
          background: white;
          opacity: 0.7;
        }

        :global(.swiper-pagination-bullet-active) {
          background: white;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default PromoSlider;
