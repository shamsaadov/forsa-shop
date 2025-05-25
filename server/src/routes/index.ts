import express from "express";
import orderRoutes from "./orders";
import userRoutes from "./admin/users";
import { authenticate, isAdmin } from "../middleware/auth";

const router = express.Router();

// Защита всех маршрутов админки
router.use(authenticate, isAdmin);

// Регистрируем подмаршруты
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);

export default router;
