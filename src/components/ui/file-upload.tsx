import React, { useState, useRef, ChangeEvent } from "react";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import { Button } from "./button";
import api from "@/services/api";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  className?: string;
  uploadType?: "category" | "product" | "misc";
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentImage,
  className = "",
  uploadType = "misc",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обработчик изменения файла
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WEBP)",
      );
      return;
    }

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Размер файла превышает 5MB");
      return;
    }

    // Сброс ошибки
    setError(null);

    // Показываем превью загружаемого файла
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);

    // Загрузка файла на сервер
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(
        `/uploads/image?type=${uploadType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Вызываем колбек с URL загруженного изображения
      onUploadComplete(response.data.url);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.response?.data?.message || "Ошибка при загрузке файла");
      setPreview(currentImage || null); // Возвращаем исходное изображение в случае ошибки
    } finally {
      setIsUploading(false);
    }
  };

  // Обработчик удаления/сброса изображения
  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Обработчик кнопки загрузки
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-center">
        {/* Область предпросмотра и загрузки */}
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Предпросмотр"
              className="w-full h-64 object-contain border rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={handleUploadClick}
          >
            <FileImage className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Кликните или перетащите файл для загрузки
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, GIF, WEBP до 5MB
            </p>
          </div>
        )}

        {/* Кнопка загрузки */}
        <div className="mt-4 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
          />
          <Button
            type="button"
            variant={preview ? "outline" : "default"}
            className="w-full"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Загрузка...
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                {preview ? "Заменить изображение" : "Загрузить изображение"}
              </span>
            )}
          </Button>
        </div>

        {/* Сообщение об ошибке */}
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default FileUpload;
