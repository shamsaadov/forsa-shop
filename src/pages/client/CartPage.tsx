import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  MinusCircle,
  PlusCircle,
  ShoppingBag,
  Phone,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ClipboardCheck,
  Check,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Форма заказа
interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  notes: string;
}

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();

  console.log(items);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    notes: "",
  });

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<OrderFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [adminOrderSuccess, setAdminOrderSuccess] = useState(false);

  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Сброс ошибки для поля, которое редактируется
    if (formErrors[name as keyof OrderFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<OrderFormData> = {};

    if (!formData.customer_name.trim()) {
      errors.customer_name = "Пожалуйста, укажите имя";
    }

    if (!formData.customer_phone.trim()) {
      errors.customer_phone = "Пожалуйста, укажите телефон";
    } else if (
      !/^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(
        formData.customer_phone,
      )
    ) {
      errors.customer_phone = "Укажите корректный номер телефона";
    }

    if (!formData.customer_email.trim()) {
      errors.customer_email = "Пожалуйста, укажите email";
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      errors.customer_email = "Укажите корректный email";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Оформление заказа
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setOrderError(
        "Ваша корзина пуста. Добавьте товары перед оформлением заказа.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        total_amount: getCartTotal(),
        payment_method: "cash", // По умолчанию наличные
        status: "pending", // Начальный статус
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders", orderData);

      // Очистка корзины после успешного оформления
      clearCart();
      setOrderSuccess(true);

      // Сбросить форму
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        address: "",
        notes: "",
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      setOrderError(
        error.response?.data?.message ||
          "Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Быстрое оформление заказа в админку
  const handleAdminOrder = async () => {
    if (items.length === 0) {
      setOrderError(
        "Ваша корзина пуста. Добавьте товары перед оформлением заказа.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Создаем заказ с минимальными данными и пометкой "admin_order"
      const orderData = {
        customer_name: "Быстрый заказ",
        customer_email: "admin@forsa-potolki.ru",
        customer_phone: "79998887766",
        address: "",
        notes:
          "Заказ создан через быструю кнопку в админку. Требует обработки администратором.",
        total_amount: getCartTotal(),
        payment_method: "cash",
        status: "pending",
        admin_order: true, // Пометка для админки
        items: items.map((item: any) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/api/orders", orderData);

      // Очистка корзины после успешного оформления
      clearCart();
      setAdminOrderSuccess(true);
    } catch (error: any) {
      console.error("Error creating admin order:", error);
      setOrderError(
        error.response?.data?.message ||
          "Произошла ошибка при оформлении заказа в админку. Пожалуйста, попробуйте позже.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Отправка заказа через WhatsApp
  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      setOrderError(
        "Ваша корзина пуста. Добавьте товары перед оформлением заказа.",
      );
      return;
    }

    const cartItemsText = items
      .map(
        (item: any) =>
          `• ${item.name} - ${item.quantity} м² x ${item.price} ₽ = ${item.quantity * item.price} ₽`,
      )
      .join("%0A");

    const totalText = `%0A%0AИтого: ${getCartTotal()} ₽`;

    const message = `Здравствуйте! Я хочу оформить заказ:%0A%0A${cartItemsText}${totalText}`;

    // Открываем WhatsApp с предварительно составленным сообщением
    window.open(`https://wa.me/79998887766?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Корзина</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ваша корзина пуста
          </h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Link to="/categories">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Таблица товаров */}
          <div className="lg:w-3/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4 text-left">Товар</th>
                    <th className="py-3 px-4 text-center">Количество</th>
                    <th className="py-3 px-4 text-right">Сумма</th>
                    <th className="py-3 px-4 text-center">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item: any) => (
                    <tr key={item.product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center text-gray-500">
                              <ShoppingBag className="h-8 w-8" />
                            </div>
                          )}
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Уменьшить количество"
                          >
                            <MinusCircle className="h-5 w-5" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Увеличить количество"
                          >
                            <PlusCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {(item.product.price * item.quantity)?.toLocaleString()}{" "}
                        ₽
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/categories"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Продолжить покупки
              </Link>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить корзину
              </Button>
            </div>
          </div>

          {/* Итоги и оформление */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Итого
              </h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Сумма заказа:</span>
                  <span>{getCartTotal()?.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t">
                  <span>К оплате:</span>
                  <span>{getCartTotal()?.toLocaleString()} ₽</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 h-auto"
                  onClick={() => setShowCheckoutForm(true)}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Оформить заказ
                </Button>

                {/*<Button*/}
                {/*  className="w-full bg-green-600 hover:bg-green-700 py-3 h-auto"*/}
                {/*  onClick={handleAdminOrder}*/}
                {/*  disabled={isSubmitting}*/}
                {/*>*/}
                {/*  <ClipboardCheck className="h-5 w-5 mr-2" />*/}
                {/*  {isSubmitting ? (*/}
                {/*    <>*/}
                {/*      <Loader2 className="h-4 w-4 mr-2 animate-spin" />*/}
                {/*      Отправка...*/}
                {/*    </>*/}
                {/*  ) : (*/}
                {/*    "Отправить в админку"*/}
                {/*  )}*/}
                {/*</Button>*/}

                {/*<Button*/}
                {/*  variant="outline"*/}
                {/*  className="w-full py-3 h-auto"*/}
                {/*  onClick={handleWhatsAppOrder}*/}
                {/*>*/}
                {/*  <Phone className="h-5 w-5 mr-2" />*/}
                {/*  Заказать через WhatsApp*/}
                {/*</Button>*/}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <p>
                <strong>Как работает оформление заказа:</strong>
                <br />
                После оформления заказа наш менеджер свяжется с вами для
                уточнения деталей и организации замера.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Форма оформления заказа */}
      <Dialog open={showCheckoutForm} onOpenChange={setShowCheckoutForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните форму для оформления заказа. Наш менеджер свяжется с
              вами для подтверждения.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckout} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="customer_name">
                Ваше имя <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className={formErrors.customer_name ? "border-red-300" : ""}
              />
              {formErrors.customer_name && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.customer_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="customer_phone">
                Телефон <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_phone"
                name="customer_phone"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={formData.customer_phone}
                type="number"
                onChange={handleInputChange}
                className={formErrors.customer_phone ? "border-red-300" : ""}
              />
              {formErrors.customer_phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.customer_phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="customer_email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customer_email"
                name="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={handleInputChange}
                className={formErrors.customer_email ? "border-red-300" : ""}
              />
              {formErrors.customer_email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.customer_email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="notes">Примечания к заказу</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckoutForm(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Оформить заказ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модальное окно успешного оформления заказа */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              Заказ успешно оформлен
            </DialogTitle>
            <DialogDescription>
              Ваш заказ принят и передан в обработку. Наш менеджер свяжется с
              вами в ближайшее время для подтверждения заказа.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => {
                setOrderSuccess(false);
                navigate("/");
              }}
            >
              Вернуться на главную
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно успешного оформления заказа в админку */}
      <Dialog open={adminOrderSuccess} onOpenChange={setAdminOrderSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              Заказ отправлен в административную панель
            </DialogTitle>
            <DialogDescription>
              Ваш заказ успешно отправлен напрямую в административную панель.
              Администратор обработает его в кратчайшие сроки и свяжется с вами.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => {
                setAdminOrderSuccess(false);
                navigate("/");
              }}
            >
              Вернуться на главную
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно с ошибкой */}
      <Dialog open={!!orderError} onOpenChange={() => setOrderError(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              Ошибка при оформлении заказа
            </DialogTitle>
            <DialogDescription>{orderError}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button className="w-full" onClick={() => setOrderError(null)}>
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
