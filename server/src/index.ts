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
app.disable("etag");
const PORT = 3000;

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

// Обслуживаем статические файлы фронтенда из папки public
const publicPath = path.join(__dirname, "../public");
console.log("Public directory path:", publicPath);
app.use(express.static(publicPath));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); // Старые маршруты для обратной совместимости
app.use("/api/admin", adminNewRoutes); // Новые структурированные маршруты
app.use("/api/uploads", uploadRoutes);

// SPA fallback - обрабатываем все остальные GET запросы
app.get("/", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res
      .status(404)
      .send("Frontend files not found. Make sure the app is built properly.");
  }
});

// Fallback для всех остальных путей (SPA routing)
app.use((req, res, next) => {
  // Только для GET запросов и если это не API
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res
        .status(404)
        .send("Frontend files not found. Make sure the app is built properly.");
    }
  } else {
    next();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
});

export default app;
