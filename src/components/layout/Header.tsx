import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 flex items-center"
          >
            <span className="text-yellow-500">F</span>orsa
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex space-x-6">
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

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
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
              className="md:hidden text-gray-700 hover:text-blue-600"
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
          <nav className="md:hidden pt-4 pb-2 space-y-2">
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
      </div>
    </header>
  );
};

export default Header;
