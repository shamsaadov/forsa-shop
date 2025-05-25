import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Import routes
import categoryRoutes from "./routes/categories";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import productRoutes from "./routes/products";
import adminRoutes from "./routes/admin";
import adminNewRoutes from "./routes/admin/index";
import uploadRoutes from "./routes/uploads";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3333;

// Настраиваем CORS с нужными опциями
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Разрешаем запросы с этих источников
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // Разрешаем передачу cookies и авторизационных заголовков
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка для статических файлов - абсолютный путь к папке uploads
const uploadsPath = path.join(__dirname, "../../uploads");
console.log("Uploads directory path:", uploadsPath);

// Создаем директорию uploads, если она не существует
if (!fs.existsSync(uploadsPath)) {
  console.log("Creating uploads directory...");
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Обслуживаем статические файлы из директории uploads
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); // Старые маршруты для обратной совместимости
app.use("/api/admin", adminNewRoutes); // Новые структурированные маршруты
app.use("/api/uploads", uploadRoutes);

// Root route
app.get("/", (_, res) => {
  res.send("Forsa Shop API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
