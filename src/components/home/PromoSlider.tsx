import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Статические данные для акций и специальных предложений
const promoItems = [
  {
    id: 1,
    title: "Скидка 20% на все глянцевые потолки",
    description:
      "Акция действует до конца месяца. Сделайте заказ сейчас и получите установку в подарок!",
    image:
      "https://images.unsplash.com/photo-1631136356070-1a07393e50cc?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Подробнее",
    buttonLink: "/categories/glossy",
    textColor: "text-white",
    bgColor: "bg-gradient-to-r from-blue-700/60 to-blue-900/60",
  },
  {
    id: 2,
    title: "Новая коллекция фактурных потолков",
    description:
      "Уникальные дизайнерские решения для вашего интерьера. Более 50 новых фактур в нашем каталоге.",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Смотреть каталог",
    buttonLink: "/categories/textured",
    textColor: "text-gray-900",
    bgColor: "bg-gradient-to-r from-gray-100/70 to-white/70",
  },
  {
    id: 3,
    title: "Многоуровневые потолки со скидкой 15%",
    description:
      "Создайте уникальное световое решение с многоуровневыми натяжными потолками. Бесплатный дизайн-проект в подарок!",
    image:
      "https://images.unsplash.com/photo-1594935913330-e5dc86241eae?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Заказать замер",
    buttonLink: "/categories/multilevel",
    textColor: "text-white",
    bgColor: "bg-gradient-to-r from-blue-600/60 to-indigo-900/60",
  },
  {
    id: 4,
    title: "Распродажа образцов — скидки до 50%",
    description:
      "Приобретите выставочные образцы натяжных потолков с максимальной выгодой. Количество товаров ограничено!",
    image:
      "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Смотреть предложения",
    buttonLink: "/sale",
    textColor: "text-white",
    bgColor: "bg-gradient-to-r from-red-600/60 to-red-900/60",
  },
];

const PromoSlider: React.FC = () => {
  return (
    <div className="relative">
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
        loop={true}
        className="rounded-lg overflow-hidden shadow-md"
      >
        {promoItems.map((item) => (
          <SwiperSlide key={item.id}>
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
