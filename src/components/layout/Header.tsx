import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchComponent, { MobileSearch } from "@/components/ui/search";

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 flex items-center flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="1681.04pt"
              height="510.261pt"
              viewBox="0 0 1681.04 510.261"
            >
              <defs>
                <clipPath id="clip_1">
                  <path
                    transform="matrix(1,0,0,-1,0,510.261)"
                    d="M0 510.261H1681.043V0H0Z"
                  />
                </clipPath>
              </defs>
              <g>
                <path
                  transform="matrix(1,0,0,-1,248.6593,285.2116)"
                  d="M0 0H57.157V40.654H4.561Z"
                  fill="#3d4e78"
                />
                <path
                  transform="matrix(1,0,0,-1,169.8423,146.03818)"
                  d="M0 0V-218.926H45.323V-139.173-98.52-40.659H148.007V0Z"
                  fill="#3d4e78"
                />
                <g clip-path="url(#clip_1)">
                  <path
                    transform="matrix(1,0,0,-1,897.0699,197.3306)"
                    d="M0 0C6.899-6.675 10.352-16.058 10.352-28.148 10.352-40.032 6.899-49.366 0-56.139-6.902-62.916-17.346-66.303-31.335-66.303H-68.266V10.008H-31.335C-17.346 10.008-6.902 6.671 0 0M59.873-167.635 16.122-97.451C16.25-97.389 16.38-97.328 16.507-97.265 29.189-91.01 38.982-81.995 45.884-70.212 52.783-58.436 56.236-44.411 56.236-28.148 56.236-11.679 52.783 2.502 45.884 14.386 38.982 26.271 29.189 35.389 16.507 41.752 3.821 48.11-11.287 51.291-28.817 51.291H-113.591V-167.635H-68.266V-106.648H-28.817C-28.103-106.648-27.394-106.641-26.688-106.63L10.911-167.635Z"
                    fill="#3d4e78"
                  />
                  <path
                    transform="matrix(1,0,0,-1,1157.4169,368.7185)"
                    d="M0 0C-15.668 0-30.684 2.346-45.044 7.037-59.409 11.729-70.973 17.827-79.737 25.333L-64.349 63.489C-55.956 56.814-46.024 51.341-34.553 47.069-23.082 42.793-11.471 40.658 .281 40.658 9.232 40.658 16.46 41.645 21.962 43.629 27.462 45.608 31.519 48.369 34.133 51.917 36.743 55.46 38.051 59.526 38.051 64.114 38.051 69.949 35.996 74.591 31.894 78.031 27.791 81.472 22.382 84.287 15.669 86.476 8.954 88.665 1.54 90.747-6.574 92.731-14.688 94.71-22.802 97.159-30.916 100.081-39.029 102.998-46.443 106.751-53.158 111.34-59.873 115.923-65.328 121.973-69.525 129.479-73.722 136.985-75.82 146.573-75.82 158.253-75.82 170.762-72.791 182.178-66.727 192.498-60.668 202.82-51.527 211.054-39.309 217.206-27.095 223.353-11.75 226.432 6.715 226.432 19.025 226.432 31.148 224.814 43.086 221.585 55.021 218.35 65.561 213.502 74.702 207.042L60.713 168.573C51.572 174.408 42.43 178.738 33.293 181.552 24.154 184.367 15.2 185.774 6.435 185.774-2.334 185.774-9.512 184.626-15.108 182.334-20.704 180.038-24.717 177.066-27.139 173.421-29.565 169.771-30.776 165.548-30.776 160.754-30.776 155.125-28.725 150.59-24.62 147.15-20.52 143.709-15.108 140.944-8.393 138.862-1.679 136.775 5.736 134.688 13.85 132.607 21.962 130.52 30.076 128.121 38.19 125.414 46.304 122.702 53.717 119.051 60.432 114.468 67.148 109.879 72.603 103.834 76.799 96.328 80.996 88.821 83.095 79.331 83.095 67.867 83.095 55.563 80.017 44.303 73.863 34.09 67.707 23.872 58.519 15.638 46.304 9.383 34.084 3.128 18.65 0 0 0"
                    fill="#3d4e78"
                  />
                  <path
                    transform="matrix(1,0,0,-1,1568.3478,364.96528)"
                    d="M0 0-87.571 218.926H-132.336L-219.627 0H-173.184L-110.251 169.167-47.562 0Z"
                    fill="#3d4e78"
                  />
                  <path
                    transform="matrix(1,0,0,-1,480.8495,258.8772)"
                    d="M0 0C0-54.905 44.472-99.921 101.01-104.221 92.081-106.184 82.76-107.222 73.178-107.222 6.927-107.222-46.775-57.667-46.775 3.455-46.775 64.583 6.927 114.138 73.178 114.138 91.4 114.138 108.669 110.388 124.134 103.682 119.471 104.261 114.717 104.556 109.889 104.556 49.197 104.556 0 57.747 0 0"
                    fill="#3d4e78"
                  />
                  <path
                    transform="matrix(1,0,0,-1,657.0118,254.88329)"
                    d="M0 0C0-40.092-33.471-72.588-74.761-72.588-82.697-72.588-90.35-71.385-97.527-69.161-64.158-67.266-37.641-37.471-37.641-.998-37.641 36.705-65.967 67.266-100.908 67.266-101.617 67.266-102.321 67.255-103.024 67.221-94.305 70.687-84.762 72.593-74.761 72.593-33.471 72.593 0 40.092 0 0"
                    fill="#f2cb51"
                  />
                </g>
              </g>
            </svg>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden lg:flex space-x-6 flex-shrink-0">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Главная
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Каталог
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              О нас
            </Link>
            <Link
              to="/news"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Новости
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Блог
            </Link>
          </nav>

          {/* Поиск на десктопе */}
          <div className="hidden md:block flex-1 max-w-lg mx-6">
            <SearchComponent />
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Поиск на мобильных */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Поиск"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Корзина */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Кнопки входа/админки/выхода */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Админка
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Войти
                </Button>
              </Link>
            )}

            {/* Кнопка мобильного меню */}
            <button
              className="lg:hidden text-gray-700 hover:text-blue-600"
              onClick={toggleMobileMenu}
              aria-label="Меню"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pt-4 pb-2 space-y-2 border-t border-gray-100">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMobileMenu}
            >
              Главная
            </Link>
            <Link
              to="/categories"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMobileMenu}
            >
              Каталог
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMobileMenu}
            >
              О нас
            </Link>
            <Link
              to="/news"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMobileMenu}
            >
              Новости
            </Link>
            <Link
              to="/blog"
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={toggleMobileMenu}
            >
              Блог
            </Link>
          </nav>
        )}

        {/* Поиск на планшетах */}
        <div className="md:block lg:hidden mt-4">
          <SearchComponent />
        </div>
      </div>

      {/* Мобильный поиск */}
      <MobileSearch
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </header>
  );
};

export default Header;
