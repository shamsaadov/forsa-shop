import React, { useState, useEffect } from "react";
import { X, Phone, Clock, Star, MapPin, Zap } from "lucide-react";

const TopBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Запускаем анимацию после монтирования компонента
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Определяем контент баннера в зависимости от времени
  const getBannerContent = () => {
    const hour = new Date().getHours();
    const isWorkingHours = hour >= 9 && hour <= 21;

    return {
      mainText: "Доставка по всей России",
      accent: isWorkingHours ? "Работаем сейчас!" : "Заказ на сайте 24/7",
      phone: "+7 (999) 888-77-66",
      hours: "с 9:00 до 21:00",
      isWorking: isWorkingHours,
    };
  };

  const content = getBannerContent();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden transition-all duration-700 ${isAnimated ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-full"}`}
    >
      {/* Главный градиентный фон */}
      <div className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 relative">
        {/* Анимированные декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Движущиеся точки */}
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-4 right-1/3 w-1 h-1 bg-yellow-300/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>

          {/* Геометрические формы */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full transform -translate-x-10 translate-y-10"></div>

          {/* Волновой паттерн */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 Q250,20 500,50 T1000,50 V100 H0 Z"
              fill="white"
              opacity="0.1"
              clipPath="none"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="M0,50 Q250,20 500,50 T1000,50 V100 H0 Z;
                        M0,50 Q250,80 500,50 T1000,50 V100 H0 Z;
                        M0,50 Q250,20 500,50 T1000,50 V100 H0 Z"
              />
            </path>
          </svg>
        </div>

        <div className="container mx-auto relative z-20 py-3 px-4">
          <div className="flex items-center justify-between">
            {/* Левая часть с грузовиком и основным текстом */}
            <div className="flex items-center space-x-4">
              {/* SVG грузовик с анимацией */}
              <div className="relative">
                <div className="w-12 h-8 relative">
                  <svg viewBox="0 0 64 40" className="w-full h-full">
                    {/* Тень грузовика */}
                    <ellipse
                      cx="32"
                      cy="38"
                      rx="28"
                      ry="2"
                      fill="black"
                      opacity="0.2"
                    />

                    {/* Основа грузовика */}
                    <rect
                      x="8"
                      y="16"
                      width="24"
                      height="12"
                      rx="2"
                      fill="#3B82F6"
                      className="animate-pulse"
                    />
                    <rect
                      x="32"
                      y="20"
                      width="20"
                      height="8"
                      rx="1"
                      fill="#1E40AF"
                    />

                    {/* Кабина */}
                    <rect
                      x="6"
                      y="12"
                      width="12"
                      height="8"
                      rx="2"
                      fill="#1D4ED8"
                    />
                    <rect
                      x="8"
                      y="14"
                      width="8"
                      height="4"
                      rx="1"
                      fill="#60A5FA"
                      opacity="0.7"
                    />

                    {/* Колеса */}
                    <circle cx="16" cy="28" r="4" fill="#374151" />
                    <circle cx="16" cy="28" r="2.5" fill="#6B7280" />
                    <circle cx="44" cy="28" r="4" fill="#374151" />
                    <circle cx="44" cy="28" r="2.5" fill="#6B7280" />

                    {/* Фары */}
                    <circle
                      cx="6"
                      cy="16"
                      r="1.5"
                      fill="#FEF08A"
                      className="animate-ping"
                    />

                    {/* Дым из трубы */}
                    <g opacity="0.6">
                      <circle
                        cx="12"
                        cy="8"
                        r="1"
                        fill="white"
                        className="animate-bounce"
                      >
                        <animate
                          attributeName="cy"
                          values="8;4;8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="14"
                        cy="6"
                        r="0.8"
                        fill="white"
                        className="animate-bounce"
                      >
                        <animate
                          attributeName="cy"
                          values="6;2;6"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.5;0;0.5"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  </svg>
                </div>

                {/* Искрящиеся эффекты вокруг грузовика */}
                <div className="absolute -top-1 -right-1 w-2 h-2">
                  <Star className="w-2 h-2 text-yellow-300 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5">
                  <Zap className="w-1.5 h-1.5 text-blue-200 animate-pulse" />
                </div>
              </div>

              {/* Основной текст с эффектами */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div className="relative">
                  <h2 className="text-white font-bold text-lg sm:text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {content.mainText}
                  </h2>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent rounded"></div>
                </div>

                {/* Статус работы */}
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    content.isWorking
                      ? "bg-green-400/20 text-green-100 border border-green-400/30"
                      : "bg-blue-400/20 text-blue-100 border border-blue-400/30"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${content.isWorking ? "bg-green-400 animate-pulse" : "bg-blue-400"}`}
                  ></div>
                  <span>{content.accent}</span>
                </div>
              </div>
            </div>

            {/* Центральная часть - контакты (скрывается на мобильных) */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Clock className="h-4 w-4 text-blue-200" />
                <span className="text-white text-sm font-medium">
                  Работаем {content.hours}
                </span>
              </div>

              <a
                href={`tel:${content.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Phone className="h-4 w-4" />
                <span>{content.phone}</span>
              </a>
            </div>

            {/* Правая часть - дополнительная информация */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-white/90">
                <MapPin className="h-4 w-4 text-emerald-300" />
                <span className="text-sm">Вся Россия</span>
              </div>

              <div className="flex items-center space-x-1 bg-emerald-400/20 text-emerald-100 px-2 py-1 rounded-md text-xs font-medium border border-emerald-400/30">
                <Star className="h-3 w-3" />
                <span>Бесплатно от 20м²</span>
              </div>
            </div>

            {/* Мобильная версия телефона */}
            <div className="md:hidden">
              <a
                href={`tel:${content.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1.5 rounded-lg font-bold text-xs hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
              >
                <Phone className="h-3 w-3" />
                <span className="hidden xs:inline">Звонок</span>
              </a>
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 p-1.5 rounded-full backdrop-blur-sm border border-white/20"
              aria-label="Закрыть баннер"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Мобильная дополнительная информация */}
          <div className="md:hidden mt-2 flex items-center justify-center space-x-4 text-white/90 text-xs">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>Вся Россия</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-300" />
              <span>Бесплатно от 20м²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
