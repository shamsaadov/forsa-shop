import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, UserCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import { User } from '@/types';
import api from '@/services/api';

interface UserWithoutPassword extends Omit<User, 'password'> {
    password?: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserWithoutPassword[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<UserWithoutPassword | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Получение списка пользователей
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get<UserWithoutPassword[]>('/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Не удалось загрузить список пользователей. Пожалуйста, попробуйте позже.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Обработчик поиска
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Фильтрация пользователей
    const filteredUsers = users.filter(
        user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Диалог подтверждения удаления
    const openDeleteDialog = (user: UserWithoutPassword) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    // Обработчик удаления пользователя
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/admin/users/${userToDelete.id}`);

            // Обновляем список пользователей
            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== userToDelete.id)
            );

            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Ошибка при удалении пользователя');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Пользователи</h1>
                    <p className="text-gray-600 mt-1">Управление пользователями системы</p>
                </div>
                <Link to="/admin/users/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
                        <Plus className="h-5 w-5 mr-1" />
                        Добавить пользователя
                    </Button>
                </Link>
            </div>

            {/* Поиск */}
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-md"
                />
            </div>

            {/* Список пользователей */}
            {loading ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="animate-pulse p-4">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex py-3 space-x-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                    {error}
                    <Button
                        onClick={() => fetchUsers()}
                        variant="outline"
                        className="mt-2 ml-2"
                    >
                        Попробовать снова
                    </Button>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white shadow rounded-lg">
                    {searchTerm ? (
                        <p className="text-gray-600">По запросу "{searchTerm}" пользователи не найдены</p>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-4">Пользователи не найдены</p>
                            <Link to="/admin/users/create">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Добавить первого пользователя
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Пользователь
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Роль
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Действия
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <UserCircle className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            {user.email && (
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <Link to={`/admin/users/edit/${user.id}`}>
                                            <Button variant="outline" size="sm" className="flex items-center">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center text-red-500 hover:text-red-600"
                                            onClick={() => openDeleteDialog(user)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Диалог подтверждения удаления */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Подтвердите удаление</DialogTitle>
                        <DialogDescription>
                            Вы действительно хотите удалить пользователя "{userToDelete?.username}"?
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
                            onClick={handleDeleteUser}
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

export default AdminUsersPage;
