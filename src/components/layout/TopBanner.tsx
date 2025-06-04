import React, { useState, useEffect } from "react";
import { Truck, X, Phone, Clock, Star } from "lucide-react";

const TopBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem("topBannerVisible");
    return saved !== "false";
  });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("topBannerVisible", "false");
  };

  const getBannerContent = () => {
    const hour = new Date().getHours();
    const isWorkingHours = hour >= 9 && hour <= 21;

    return {
      mainText: "Доставка по всей России",
      accent: isWorkingHours ? "Работаем сейчас!" : "Заказ на сайте 24/7",
      phone: "+7 (999) 888-77-66",
      hours: "с 9:00 до 21:00",
    };
  };

  const content = getBannerContent();

  if (!isVisible) return null;

  return (
    <div
      className={`bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white py-3 px-4 relative overflow-hidden transition-all duration-500 ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      {/* Декоративный фон */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-sm">
          {/* Основное сообщение */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Truck className="h-4 w-4 flex-shrink-0 animate-pulse" />
            <span className="font-semibold">{content.mainText}</span>
            <Star className="h-3 w-3 text-yellow-300 animate-pulse" />
          </div>

          {/* Информация о работе */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors">
            <Clock className="h-4 w-4" />
            <span>{content.hours}</span>
          </div>

          {/* Контактный телефон */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition-colors">
            <Phone className="h-4 w-4" />
            <a
              href={`tel:${content.phone.replace(/\D/g, "")}`}
              className="hover:underline font-medium"
            >
              {content.phone}
            </a>
          </div>

          {/* Мобильная версия - акция */}
          <div className="md:hidden flex items-center gap-1 text-yellow-300 font-medium">
            <Star className="h-3 w-3" />
            <span className="text-xs">Бесплатная доставка от 20м²</span>
          </div>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 transition-colors p-1.5 rounded-full"
          aria-label="Закрыть баннер"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopBanner;
