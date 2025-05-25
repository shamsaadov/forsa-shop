import { ResultSetHeader, RowDataPacket, OkPacket } from "mysql2";
import pool from "../config/db";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface Order extends RowDataPacket {
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

const orderModel = {
  // Получить все заказы
  async getAllOrders(
    limit: number = 100,
    offset: number = 0,
  ): Promise<Order[]> {
    const [rows] = await pool.query<Order[]>(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset],
    );
    return rows;
  },

  // Получить заказы с возможностью поиска и фильтрации
  async getFilteredOrders(
    search?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Order[]> {
    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    if (search) {
      query +=
        " AND (customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (startDate) {
      query += " AND created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND created_at <= ?";
      params.push(endDate);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query<Order[]>(query, params);
    return rows;
  },

  // Получить заказ по ID
  async getOrderById(id: number): Promise<Order | null> {
    const [rows] = await pool.query<Order[]>(
      "SELECT * FROM orders WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const order = rows[0];

    // Получаем позиции заказа
    const [items] = await pool.query<OrderItem[] & RowDataPacket[]>(
      "SELECT oi.*, p.name as product_name, p.price as product_price FROM order_items oi " +
        "LEFT JOIN products p ON oi.product_id = p.id " +
        "WHERE oi.order_id = ?",
      [id],
    );

    order.items = items;
    return order;
  },

  // Создать новый заказ
  // server/src/models/order.ts

  async createOrder(
    orderData: {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      address: string | null;
      status: string;
      total_amount: number;
      payment_method: string;
      notes: string | null;
    },
    orderItems: {
      product_id: number;
      quantity: number;
    }[],
  ): Promise<number> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Создаём заказ без user_id
      const [orderResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO orders
         (customer_name,
          customer_email,
          customer_phone,
          address,
          status,
          total_amount,
          payment_method,
          notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.customer_name,
          orderData.customer_email,
          orderData.customer_phone,
          orderData.address,
          orderData.status,
          orderData.total_amount,
          orderData.payment_method,
          orderData.notes,
        ],
      );

      const orderId = orderResult.insertId;

      // Добавляем позиции заказа
      for (const item of orderItems) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO order_items
           (order_id, product_id, quantity)
         VALUES (?, ?, ?)`,
          [orderId, item.product_id, item.quantity],
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Обновить статус заказа
  async updateOrderStatus(id: number, status: string): Promise<boolean> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id],
    );

    return result.affectedRows > 0;
  },

  // Обновить информацию о заказе
  async updateOrder(
    id: number,
    orderData: {
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      address?: string | null;
      status?: string;
      payment_method?: string;
      notes?: string | null;
    },
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(orderData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    const [result] = await pool.query<OkPacket>(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  },

  // Удалить заказ
  async deleteOrder(id: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Удаляем позиции заказа
      await connection.query("DELETE FROM order_items WHERE order_id = ?", [
        id,
      ]);

      // Удаляем заказ
      const [result] = await connection.query<OkPacket>(
        "DELETE FROM orders WHERE id = ?",
        [id],
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Получить статистику по заказам
  async getOrdersStats(): Promise<any> {
    const [totalOrders] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM orders",
    );

    const [pendingOrders] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as pending FROM orders WHERE status = 'pending'",
    );

    const [totalRevenue] = await pool.query<RowDataPacket[]>(
      "SELECT SUM(total_amount) as revenue FROM orders",
    );

    const [statusCounts] = await pool.query<RowDataPacket[]>(
      "SELECT status, COUNT(*) as count FROM orders GROUP BY status",
    );

    return {
      totalOrders: totalOrders[0].total,
      pendingOrders: pendingOrders[0].pending,
      totalRevenue: totalRevenue[0].revenue || 0,
      statusCounts,
    };
  },

  // Получить заказы пользователя
  async getUserOrders(userId: number): Promise<Order[]> {
    const [orders] = await pool.query<Order[]>(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );

    // Получаем позиции для всех заказов пользователя
    for (const order of orders) {
      const [items] = await pool.query<OrderItem[] & RowDataPacket[]>(
        "SELECT oi.*, p.name as product_name, p.price as product_price FROM order_items oi " +
          "LEFT JOIN products p ON oi.product_id = p.id " +
          "WHERE oi.order_id = ?",
        [order.id],
      );

      order.items = items;
    }

    return orders;
  },
};

export default orderModel;
