import React from "react";
import { MapPin, Phone, Clock, Award, Users, Shield } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12">
      {/* Заголовок */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          О компании Forsa
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Мы создаем красивые и практичные натяжные потолки для вашего дома и
          бизнеса уже более 10 лет
        </p>
      </div>

      {/* История компании */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">
              Компания Forsa была основана в 2012 году с целью предоставить
              клиентам высококачественные натяжные потолки по доступным ценам.
              Мы начинали как небольшая команда энтузиастов, стремящихся
              создавать красивые и долговечные решения для оформления потолков.
            </p>
            <p className="text-gray-600 mb-4">
              За годы работы мы превратились в надежного поставщика натяжных
              потолков с собственным производством и командой профессиональных
              монтажников. Наша компания постоянно развивается, внедряя новые
              технологии и материалы для создания потолков любой сложности.
            </p>
            <p className="text-gray-600">
              Сегодня Forsa - это бренд, который ассоциируется с качеством,
              надежностью и инновациями в сфере натяжных потолков. Мы гордимся
              тысячами выполненных проектов и довольных клиентов.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Наши достижения
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-bold block text-gray-800">
                    10+ лет на рынке
                  </span>
                  <span className="text-gray-600 text-sm">
                    Стабильно работаем с 2012 года
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-bold block text-gray-800">
                    5000+ клиентов
                  </span>
                  <span className="text-gray-600 text-sm">
                    Доверяют нам свои потолки
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 rounded-full p-2 mr-3 text-blue-600">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <span className="font-bold block text-gray-800">
                    Гарантия 20 лет
                  </span>
                  <span className="text-gray-600 text-sm">
                    На все наши потолки
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Наши преимущества */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Качественные материалы
            </h3>
            <p className="text-gray-600">
              Мы используем только сертифицированные материалы от проверенных
              поставщиков, которые соответствуют всем экологическим стандартам.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Быстрый монтаж
            </h3>
            <p className="text-gray-600">
              Наши специалисты выполняют установку натяжного потолка быстро и
              аккуратно, экономя ваше время и минимизируя неудобства.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Долгий срок службы
            </h3>
            <p className="text-gray-600">
              Наши натяжные потолки сохраняют свой внешний вид и характеристики
              на протяжении многих лет, не теряя цвет и не провисая.
            </p>
          </div>
        </div>
      </div>

      {/* Как нас найти */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Контактная информация
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Наш офис
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <span className="text-gray-700">
                  г. Москва, ул. Потолочная, д. 42, офис 303
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <span className="text-gray-700">+7 (800) 555-35-35</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <div className="text-gray-700">
                  <p>Пн-Пт: 9:00 - 20:00</p>
                  <p>Сб: 10:00 - 18:00</p>
                  <p>Вс: выходной</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Свяжитесь с нами</h3>
            <p className="mb-4">
              У вас есть вопросы о наших потолках или услугах? Хотите получить
              бесплатную консультацию? Заполните форму, и наш менеджер свяжется
              с вами в ближайшее время.
            </p>
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                  type="text"
                  placeholder="Ваш телефон"
                  className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <textarea
                placeholder="Ваше сообщение"
                className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32 resize-none"
              ></textarea>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-300">
                Отправить сообщение
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
