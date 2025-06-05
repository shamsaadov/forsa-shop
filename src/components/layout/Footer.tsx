import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import ForsaLogo from "@/icons/ForsaLogo.tsx";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 flex items-center flex-shrink-0"
            >
              <ForsaLogo />
            </Link>
            <p className="text-gray-400 mb-4">
              Мы предлагаем высококачественные натяжные потолки для любых
              помещений. Украсьте свой дом с нашими стильными и долговечными
              решениями.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-300 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">
              Навигация
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Каталог
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Новости
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          {/* Категории */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">
              Категории
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/categories/classic"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Классические потолки
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/matte"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Матовые потолки
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/glossy"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Глянцевые потолки
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/multilevel"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Многоуровневые
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/printed"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  С фотопечатью
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">
              Контакты
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">+7 (800) 555-35-35</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">info@forsa-potolki.ru</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  г. Москва, ул. Потолочная, д. 42
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-gray-500 text-sm text-center">
          <p>© {new Date().getFullYear()} Forsa. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
