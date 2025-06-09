import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate, isAdmin } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Настройка директории для сохранения файлов - используем абсолютный путь
const uploadDir = path.resolve(process.cwd(), "uploads");
console.log("Upload storage directory:", uploadDir);

// Создаем все необходимые директории
const directories = [
  uploadDir,
  path.join(uploadDir, "categories"),
  path.join(uploadDir, "products"),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
    // Устанавливаем права доступа
    fs.chmodSync(dir, 0o755);
  }
});

// Создаем подпапки для разных типов изображений
const categoryImagesDir = path.join(uploadDir, "categories");
const productImagesDir = path.join(uploadDir, "products");

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Выбираем директорию в зависимости от типа загрузки
    const uploadType = req.query.type || "misc";

    if (uploadType === "category") {
      cb(null, categoryImagesDir);
    } else if (uploadType === "product") {
      cb(null, productImagesDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Разрешенные типы файлов (только изображения)
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Недопустимый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WEBP)",
      ),
    );
  }
};

// Настройка загрузчика
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Ограничение размера файла: 5MB
  },
});

// Маршрут для загрузки одного изображения
router.post(
  "/image",
  authenticate,
  isAdmin,
  upload.single("image"),
  (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
      }

      // Определяем тип загрузки для формирования корректного URL
      const uploadType = req.query.type || "misc";
      let relativePath = "";

      if (uploadType === "category") {
        relativePath = "categories/";
      } else if (uploadType === "product") {
        relativePath = "products/";
      }

      // Возвращаем URL загруженного файла
      const fileUrl = `/uploads/${relativePath}${req.file.filename}`;
      console.log("File uploaded successfully:", fileUrl);

      res.status(201).json({
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Ошибка при загрузке файла" });
    }
  },
);

// Маршрут для загрузки нескольких изображений
router.post(
  "/images",
  authenticate,
  isAdmin,
  upload.array("images", 10),
  (req: any, res: any) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Файлы не загружены" });
      }

      // Определяем тип загрузки для формирования корректного URL
      const uploadType = req.query.type || "misc";
      let relativePath = "";

      if (uploadType === "category") {
        relativePath = "categories/";
      } else if (uploadType === "product") {
        relativePath = "products/";
      }

      // Возвращаем URL загруженных файлов
      const filesData = files.map((file) => ({
        url: `/uploads/${relativePath}${file.filename}`,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
      }));

      res.status(201).json(filesData);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Ошибка при загрузке файлов" });
    }
  },
);

// Маршрут для удаления файла
router.delete(
  "/:type/:filename",
  authenticate,
  isAdmin,
  (req: any, res: any) => {
    const { type, filename } = req.params;
    let targetDir = uploadDir;

    // Определяем директорию в зависимости от типа
    if (type === "category") {
      targetDir = categoryImagesDir;
    } else if (type === "product") {
      targetDir = productImagesDir;
    }

    const filePath = path.join(targetDir, filename);

    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Файл не найден" });
    }

    try {
      // Удаляем файл
      fs.unlinkSync(filePath);
      res.json({ message: "Файл успешно удален" });
    } catch (error) {
      console.error("File deletion error:", error);
      res.status(500).json({ message: "Ошибка при удалении файла" });
    }
  },
);

// Поддержка старого маршрута для обратной совместимости
router.delete("/:filename", authenticate, isAdmin, (req: any, res: any) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  // Проверяем, существует ли файл
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Файл не найден" });
  }

  try {
    // Удаляем файл
    fs.unlinkSync(filePath);
    res.json({ message: "Файл успешно удален" });
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({ message: "Ошибка при удалении файла" });
  }
});

export default router;
