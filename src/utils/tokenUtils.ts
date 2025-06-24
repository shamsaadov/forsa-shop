// Сохранить токен в localStorage
export const saveToken = (token: string): void => {
  if (token) {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }
  }
};

// Получить токен из localStorage
export const getToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

// Удалить токен из localStorage
export const removeToken = (): void => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};
