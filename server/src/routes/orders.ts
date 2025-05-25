import express from "express";
import { authenticate } from "../middleware/auth";
import orderModel from "../models/order";
import productModel from "../models/product";

const router = express.Router();

// Создание нового заказа (доступно без авторизации)
router.post("/", async (req: any, res: any) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      notes,
      payment_method = "cash",
      items,
    } = req.body;

    // Проверка наличия обязательных полей
    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Не заполнены обязательные поля" });
    }

    // Получаем информацию о всех товарах в заказе для расчета общей суммы
    let total_amount = 0;
    const validItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Некорректные данные товара в заказе" });
      }

      try {
        // Получаем актуальную цену товара
        const product = await productModel.getProductById(item.product_id);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Товар с ID ${item.product_id} не найден` });
        }

        // Добавляем товар в список валидных товаров
        validItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
        });

        // Суммируем общую сумму заказа
        total_amount += product.price * item.quantity;
      } catch (error) {
        console.error(`Error fetching product ${item.product_id}:`, error);
        return res
          .status(500)
          .json({ message: "Ошибка при обработке товаров заказа" });
      }
    }

    // Если заказ делает авторизованный пользователь, сохраняем его ID
    const user_id = req.user ? req.user.id : null;

    // Создаем заказ
    const orderData = {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      address: address || null,
      status: "pending", // Начальный статус всегда "ожидает обработки"
      total_amount,
      payment_method,
      notes: notes || null,
    };

    const orderId = await orderModel.createOrder(orderData, validItems);

    res.status(201).json({
      message: "Заказ успешно создан",
      order_id: orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Ошибка при создании заказа" });
  }
});

// Получение заказов пользователя (требует авторизации)
router.get("/user", authenticate, async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const userId = req.user.id;
    const orders = await orderModel.getUserOrders(userId);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Ошибка при получении заказов" });
  }
});

// Получение информации о конкретном заказе (требует авторизации)
router.get("/:id", authenticate, async (req: any, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Некорректный ID заказа" });
    }

    const order = await orderModel.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    if (order.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении информации о заказе" });
  }
});

export default router;
