import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchComponent, { MobileSearch } from "@/components/ui/search";
import api from "@/services/api";
import ForsaLogo from "@/icons/ForsaLogo.tsx";

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setCategoriesOpen(false); // Закрываем категории при закрытии меню
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories?limit=5");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 flex items-center flex-shrink-0"
          >
            <ForsaLogo />
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
          <nav className="lg:hidden pt-4 pb-2 border-t border-gray-100 bg-white">
            <div className="space-y-1">
              <Link
                to="/"
                className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Главная
              </Link>

              {/* Категории с выпадающим списком */}
              <div>
                <button
                  onClick={toggleCategories}
                  className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  <span>Каталог</span>
                  {categoriesOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {/* Выпадающий список категорий */}
                {categoriesOpen && (
                  <div className="bg-gray-50 border-l-2 border-blue-200">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/categories/${category.slug}`}
                        className="block py-2 px-8 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}

                    {/* Кнопка "Посмотреть все категории" */}
                    <Link
                      to="/categories"
                      className="block py-3 px-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium text-sm transition-colors border-t border-gray-200"
                      onClick={toggleMobileMenu}
                    >
                      Посмотреть все категории →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                О нас
              </Link>
              <Link
                to="/news"
                className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Новости
              </Link>
              <Link
                to="/blog"
                className="block py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors"
                onClick={toggleMobileMenu}
              >
                Блог
              </Link>
            </div>
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
