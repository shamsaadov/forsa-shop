import express from "express";
import { authenticate, isAdmin } from "../../middleware/auth";
import orderModel from "../../models/order";

const router = express.Router();

// Middleware для проверки авторизации и прав администратора
router.use(authenticate, isAdmin);

// Получить все заказы с возможностью фильтрации и поиска
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      startDate,
      endDate,
      limit = 100,
      offset = 0,
    } = req.query;

    const orders = await orderModel.getFilteredOrders(
      search as string,
      status as string,
      startDate as string,
      endDate as string,
      Number(limit),
      Number(offset),
    );

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Ошибка при получении заказов" });
  }
});

// Получить статистику по заказам
router.get("/stats", async (req, res) => {
  try {
    const stats = await orderModel.getOrdersStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении статистики заказов" });
  }
});

// Получить заказ по ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const orderId = Number(req.params.id);
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Ошибка при получении заказа" });
  }
});

// Обновить статус заказа
router.patch("/:id/status", async (req: any, res: any) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Не указан статус заказа" });
    }

    // Проверка на допустимые значения статуса
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Недопустимый статус заказа" });
    }

    const success = await orderModel.updateOrderStatus(orderId, status);

    if (!success) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.json({ message: "Статус заказа обновлен" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Ошибка при обновлении статуса заказа" });
  }
});

// Обновить заказ
router.put("/:id", async (req: any, res: any) => {
  try {
    const orderId = Number(req.params.id);
    const orderData = req.body;

    const success = await orderModel.updateOrder(orderId, orderData);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Заказ не найден или нет данных для обновления" });
    }

    res.json({ message: "Заказ обновлен" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Ошибка при обновлении заказа" });
  }
});

// Удалить заказ
router.delete("/:id", async (req: any, res: any) => {
  try {
    const orderId = Number(req.params.id);
    const success = await orderModel.deleteOrder(orderId);

    if (!success) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.json({ message: "Заказ удален" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Ошибка при удалении заказа" });
  }
});

export default router;
