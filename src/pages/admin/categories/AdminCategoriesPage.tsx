import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import { getCategories, deleteCategory } from '@/services/categoryService';
import { Category } from '@/types';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Получение списка категорий
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Не удалось загрузить категории. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Обработчик поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Фильтрация категорий по поисковому запросу
  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Диалог подтверждения удаления
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // Обработчик удаления категории
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryToDelete.id);

      // Обновляем список категорий
      setCategories(prevCategories =>
        prevCategories.filter(cat => cat.id !== categoryToDelete.id)
      );

      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Ошибка при удалении категории');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Категории</h1>
          <p className="text-gray-600 mt-1">Управляйте категориями товаров</p>
        </div>
        <Link to="/admin/categories/create">
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
            <Plus className="h-5 w-5 mr-1" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Поиск категорий..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      {/* Список категорий */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
          <Button
            onClick={() => fetchCategories()}
            variant="outline"
            className="mt-2 ml-2"
          >
            Попробовать снова
          </Button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          {searchTerm ? (
            <p className="text-gray-600">По запросу "{searchTerm}" ничего не найдено</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">У вас еще нет категорий</p>
              <Link to="/admin/categories/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Создать первую категорию
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Link to={`/categories/${category.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Просмотр
                    </Button>
                  </Link>
                  <Link to={`/admin/categories/edit/${category.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-red-500 hover:text-red-600"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить категорию "{categoryToDelete?.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
