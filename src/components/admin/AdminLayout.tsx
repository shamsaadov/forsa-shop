import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Панель управления" },
    { path: "/admin/products", icon: Package, label: "Товары" },
    { path: "/admin/categories", icon: FolderTree, label: "Категории" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Заказы" },
    { path: "/admin/users", icon: Users, label: "Пользователи" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Верхняя панель навигации */}
      <header className="bg-white shadow z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {/* Мобильное меню */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-blue-600">
                    Forsa Admin
                  </h2>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center p-2 rounded-md ${
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/"
                        className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Home className="h-5 w-5 mr-3" />
                        На сайт
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Выйти
                      </button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Логотип */}
            <Link to="/admin" className="text-xl font-bold text-blue-600">
              Forsa Admin
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 hidden md:flex items-center"
            >
              <Home className="h-5 w-5 mr-1" />
              На сайт
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Боковое меню (для десктопа) */}
        <aside className="hidden md:block w-64 bg-white shadow-sm">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Основной контент */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
