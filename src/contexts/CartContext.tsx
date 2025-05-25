import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
}

// Создаем контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Функция для загрузки корзины из localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      return JSON.parse(storedCart);
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
    }
  }
  return [];
};

// Функция для сохранения корзины в localStorage
const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Провайдер контекста
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем корзину из localStorage при первой загрузке
  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Добавление товара в корзину
  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      // Проверяем, есть ли товар уже в корзине
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);

      if (existingItemIndex >= 0) {
        // Если товар уже есть, обновляем количество
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Если товара нет, добавляем новый
        return [...prevItems, { id: product.id, product, quantity }];
      }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // Обновление количества товара
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setItems([]);
  };

  // Получение общей стоимости товаров в корзине
  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Получение количества товаров в корзине
  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Хук для использования контекста корзины
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
