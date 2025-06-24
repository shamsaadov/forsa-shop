import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Клиентские страницы
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/client/HomePage.tsx";
import CategoriesPage from "@/pages/client/CategoriesPage.tsx";
import CategoryPage from "@/pages/client/CategoryPage.tsx";
import ProductsPage from "@/pages/client/ProductsPage.tsx";
import ProductPage from "@/pages/client/ProductPage.tsx";
import CartPage from "@/pages/client/CartPage.tsx";
import LoginPage from "@/pages/client/LoginPage.tsx";
import AboutPage from "@/pages/client/AboutPage.tsx";
import NewsPage from "@/pages/client/NewsPage.tsx";
import BlogPage from "@/pages/client/BlogPage.tsx";
import SearchPage from "@/pages/client/SearchPage.tsx";

// Админские страницы
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminCategoriesPage from "@/pages/admin/categories/AdminCategoriesPage";
import AdminCategoryForm from "@/pages/admin/categories/AdminCategoryForm";
import AdminProductsPage from "@/pages/admin/products/AdminProductsPage";
import AdminProductForm from "@/pages/admin/products/AdminProductForm";
import AdminOrdersPage from "@/pages/admin/orders/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import AdminUserForm from "@/pages/admin/users/AdminUserForm";
import ScrollToTop from "@/components/layout/ScrollToTop.tsx";
import { ToastContainer } from "react-toastify";

// Создаем клиент для React Query
const queryClient = new QueryClient();

// Компонент для защищенных админских маршрутов
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Пока проверяем авторизацию, показываем загрузку
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Если пользователь не авторизован или не админ, перенаправляем
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  alert("Здарова");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Маршруты клиентской части */}
              <Route
                path="/"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />
              <Route
                path="/categories"
                element={
                  <Layout>
                    <CategoriesPage />
                  </Layout>
                }
              />
              <Route
                path="/categories/:slug"
                element={
                  <Layout>
                    <CategoryPage />
                  </Layout>
                }
              />
              <Route
                path="/products"
                element={
                  <Layout>
                    <ProductsPage />
                  </Layout>
                }
              />
              <Route
                path="/products/:slug"
                element={
                  <Layout>
                    <ProductPage />
                  </Layout>
                }
              />
              <Route
                path="/cart"
                element={
                  <Layout>
                    <CartPage />
                  </Layout>
                }
              />
              <Route
                path="/login"
                element={
                  <Layout>
                    <LoginPage />
                  </Layout>
                }
              />
              <Route
                path="/search"
                element={
                  <Layout>
                    <SearchPage />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <AboutPage />
                  </Layout>
                }
              ></Route>
              <Route
                path="/news"
                element={
                  <Layout>
                    <NewsPage />
                  </Layout>
                }
              ></Route>
              <Route
                path="/blog"
                element={
                  <Layout>
                    <BlogPage />
                  </Layout>
                }
              ></Route>

              {/* Маршруты админ-панели */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategoriesPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories/create"
                element={
                  <AdminRoute>
                    <AdminCategoryForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories/edit/:id"
                element={
                  <AdminRoute>
                    <AdminCategoryForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/create"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/edit/:id"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrdersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users/create"
                element={
                  <AdminRoute>
                    <AdminUserForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users/edit/:id"
                element={
                  <AdminRoute>
                    <AdminUserForm />
                  </AdminRoute>
                }
              />

              {/* Обработка неизвестных маршрутов */}
              <Route
                path="*"
                element={
                  <Layout>
                    <div className="container mx-auto px-4 py-16 text-center">
                      <h1 className="text-3xl font-bold mb-4">
                        404 - Страница не найдена
                      </h1>
                      <p className="mb-6">
                        Запрашиваемая страница не существует
                      </p>
                      <a href="/" className="text-blue-600 hover:text-blue-800">
                        Вернуться на главную
                      </a>
                    </div>
                  </Layout>
                }
              />
            </Routes>
            <ToastContainer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
