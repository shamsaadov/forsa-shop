import express from "express";
import { authenticate, isAdmin } from "../../middleware/auth";
import userRoutes from "./users";
import orderRoutes from "./orders";
import productRoutes from "./products";

const router = express.Router();

// Защита всех маршрутов админки
router.use(authenticate, isAdmin);

// Регистрируем подмаршруты
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);

export default router;
