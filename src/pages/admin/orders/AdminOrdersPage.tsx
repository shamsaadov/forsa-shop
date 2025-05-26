import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Eye,
  PenSquare,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import AdminLayout from "@/components/admin/AdminLayout";

// Типы для заказов
interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string | null;
  status: "pending" | "processing" | "completed" | "cancelled";
  total_amount: number;
  payment_method: "cash" | "card" | "bank_transfer";
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  statusCounts: {
    status: string;
    count: number;
  }[];
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Модальные окна
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Форматирование статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Ожидает
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            В обработке
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Выполнен
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Отменен
          </Badge>
        );
      case "all":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Все статусы
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Форматирование метода оплаты
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "cash":
        return "Наличные";
      case "card":
        return "Карта";
      case "bank_transfer":
        return "Банковский перевод";
      default:
        return method;
    }
  };

  // Загрузка заказов
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Формируем URL с параметрами фильтрации
      let url = "/admin/orders?";
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      url += params.toString();

      const response = await api.get(url);
      setOrders(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Ошибка при загрузке заказов");
      setLoading(false);
    }
  };

  // Загрузка статистики
  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/orders/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching order stats:", err);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  // Загрузка заказов при изменении фильтров
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, startDate, endDate]);

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
  };

  // Получение деталей заказа
  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      setSelectedOrder(response.data);
      return response.data;
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      setError(
        err.response?.data?.message || "Ошибка при загрузке деталей заказа",
      );
      return null;
    }
  };

  // Обработчик просмотра заказа
  const handleViewOrder = async (orderId: number) => {
    const order = await fetchOrderDetails(orderId);
    if (order) {
      setShowViewModal(true);
    }
  };

  // Обработчик изменения статуса
  const handleChangeStatus = async (orderId: number) => {
    const order = await fetchOrderDetails(orderId);
    if (order) {
      setShowStatusModal(true);
    }
  };

  // Обработчик подтверждения изменения статуса
  const confirmStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/status`, {
        status: newStatus,
      });

      // Обновляем список заказов и закрываем модальное окно
      fetchOrders();
      fetchStats();
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      setError(
        err.response?.data?.message || "Ошибка при обновлении статуса заказа",
      );
    }
  };

  // Обработчик подтверждения удаления
  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      await api.delete(`/admin/orders/${selectedOrder.id}`);

      fetchOrders();
      fetchStats();
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Error deleting order:", err);
      setError(err.response?.data?.message || "Ошибка при удалении заказа");
    }
  };

  // Форматирование даты и времени
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Управление заказами</h1>
        <p className="text-gray-600">Просмотр и управление заказами клиентов</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Всего заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Ожидают</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Общая сумма</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalRevenue?.toLocaleString()} ₽
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Статусы</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1">
                {stats.statusCounts?.map((item) => (
                  <div key={item.status} className="flex justify-between">
                    <span>{getStatusBadge(item.status)}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Имя, email или телефон..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Выполнен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              От
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              До
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="md:mb-0"
          >
            <RefreshCw size={16} className="mr-2" />
            Сбросить
          </Button>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка заказов...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Заказы не найдены
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || startDate || endDate
                ? "Попробуйте изменить параметры фильтрации"
                : "В системе пока нет заказов"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{order.customer_phone}</div>
                      <div className="text-xs text-gray-500">
                        {order.customer_email}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {order.total_amount.toLocaleString()} ₽
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateTime(order.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order.id)}
                          title="Просмотр"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleChangeStatus(order.id)}
                          title="Изменить статус"
                        >
                          <PenSquare size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDeleteModal(true);
                          }}
                          title="Удалить"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Модальное окно просмотра заказа */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Заказ #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Дата создания:{" "}
              {selectedOrder && formatDateTime(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Информация о клиенте
                  </h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm">{selectedOrder.customer_phone}</p>
                    <p className="text-sm">{selectedOrder.customer_email}</p>
                    {selectedOrder.address && (
                      <p className="text-sm mt-2 text-gray-600">
                        {selectedOrder.address}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Детали заказа
                  </h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Статус:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Способ оплаты:
                      </span>
                      <span>
                        {formatPaymentMethod(selectedOrder.payment_method)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Сумма заказа:
                      </span>
                      <span className="font-semibold">
                        {selectedOrder.total_amount.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Таблица товаров */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Товары в заказе
                </h3>
                <div className="bg-gray-50 rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Товар</TableHead>
                        <TableHead className="text-right">Цена</TableHead>
                        <TableHead className="text-right">Кол-во</TableHead>
                        <TableHead className="text-right">Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items &&
                        selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell className="text-right">
                              {item.product_price.toLocaleString()} ₽
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity} м²
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {(
                                item.product_price * item.quantity
                              ).toLocaleString()}{" "}
                              ₽
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Примечания */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Примечания
                  </h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно смены статуса */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Изменить статус заказа #{selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Выберите новый статус для заказа
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={
                    selectedOrder.status === "pending" ? "default" : "outline"
                  }
                  onClick={() => confirmStatusChange("pending")}
                  className="flex flex-col items-center py-3 h-auto gap-2"
                >
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <span>Ожидает</span>
                </Button>
                <Button
                  variant={
                    selectedOrder.status === "processing"
                      ? "default"
                      : "outline"
                  }
                  onClick={() => confirmStatusChange("processing")}
                  className="flex flex-col items-center py-3 h-auto gap-2"
                >
                  <RefreshCw className="h-8 w-8 text-blue-500" />
                  <span>В обработке</span>
                </Button>
                <Button
                  variant={
                    selectedOrder.status === "completed" ? "default" : "outline"
                  }
                  onClick={() => confirmStatusChange("completed")}
                  className="flex flex-col items-center py-3 h-auto gap-2"
                >
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <span>Выполнен</span>
                </Button>
                <Button
                  variant={
                    selectedOrder.status === "cancelled" ? "default" : "outline"
                  }
                  onClick={() => confirmStatusChange("cancelled")}
                  className="flex flex-col items-center py-3 h-auto gap-2"
                >
                  <XCircle className="h-8 w-8 text-red-500" />
                  <span>Отменен</span>
                </Button>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500">
                  Текущий статус: {getStatusBadge(selectedOrder.status)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модальное окно удаления */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить заказ #{selectedOrder?.id}?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Заказ будет безвозвратно удален из
              системы.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-3 rounded-md text-sm text-red-600 mb-4">
            <p>
              Внимание! Удаление заказа приведет к потере всех связанных данных,
              включая информацию о клиенте и товарах.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              Удалить заказ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
