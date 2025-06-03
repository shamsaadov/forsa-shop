import axios from "axios";
import { getToken, removeToken } from "@/utils/tokenUtils";

console.log(import.meta.env);
// Создаем экземпляр Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "/api", // Fallback to '/api' if env var is not defined
  //baseURL: "http://localhost:3333/api", // В разработке
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Важно для работы с CORS и передачи cookies
});

// Перехватчик для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Добавляем обработчик ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Логируем ошибки для отладки
      console.error("API Error:", error.response.status, error.response.data);

      // Если ошибка авторизации, можно выполнить дополнительные действия
      if (error.response.status === 401) {
        removeToken();
        // При необходимости можно выполнять редирект на страницу логина
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error("API Request Error:", error.request);
    } else {
      // Ошибка при настройке запроса
      console.error("API Setup Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
