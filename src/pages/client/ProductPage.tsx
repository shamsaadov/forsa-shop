import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronRight,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Phone,
  AlertCircle,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import api from "@/services/api";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Загрузка товара
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Не удалось загрузить товар. Пожалуйста, попробуйте позже.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Загрузка рекомендуемых товаров
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        const response = await api.get(
          `/categories/${product.category_id}/products?limit=4&exclude=${product.id}`,
        );
        setRelatedProducts(response.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          stock: 0,
          created_at: product.created_at,
          description: product.description,
          slug: product.slug,
          updated_at: product.updated_at,
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        },
        quantity,
      );

      // Уведомление или другая логика после добавления в корзину
      alert("Товар добавлен в корзину!");
    }
  };

  // Увеличение и уменьшение количества
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Получение изображений для галереи
  const getGalleryImages = () => {
    if (!product) return [];

    // Если у товара есть галерея, используем её
    if (product.gallery_images && product.gallery_images.length > 0) {
      return product.gallery_images.map((img) => img.image_url);
    }

    // Иначе используем основное изображение
    return product.image_url
      ? [product.image_url]
      : ["https://via.placeholder.com/600x600?text=Натяжной+потолок"];
  };

  // Переключение активного изображения
  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  // Получение характеристик товара
  const getSpecifications = () => {
    if (!product) return [];

    if (product.specifications && product.specifications.length > 0) {
      return product.specifications;
    }

    // Фейковые характеристики, если настоящих нет
    return [
      { id: 1, product_id: product.id, name: "Материал", value: "ПВХ пленка" },
      { id: 2, product_id: product.id, name: "Фактура", value: "Глянцевая" },
      { id: 3, product_id: product.id, name: "Цвет", value: "Белый" },
      { id: 4, product_id: product.id, name: "Толщина", value: "0.18 мм" },
      {
        id: 5,
        product_id: product.id,
        name: "Ширина полотна",
        value: "До 5.5 м",
      },
      { id: 6, product_id: product.id, name: "Гарантия", value: "20 лет" },
    ];
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-200 h-20 w-20 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ошибка загрузки товара
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к списку товаров
          </Link>
        </div>
      </div>
    );
  }

  // Если товар не найден
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Товар не найден
          </h1>
          <p className="text-gray-600 mb-6">
            Запрашиваемый товар не существует или был удален.
          </p>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к списку товаров
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = getGalleryImages();
  const specifications = getSpecifications();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="mb-6">
        <ol className="flex flex-wrap items-center text-sm text-gray-500">
          <li className="flex items-center">
            <Link to="/" className="hover:text-blue-600">
              Главная
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </li>
          <li className="flex items-center">
            <Link to="/categories" className="hover:text-blue-600">
              Каталог
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </li>
          {product.category && (
            <li className="flex items-center">
              <Link
                to={`/categories/${product.category.slug}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </li>
          )}
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="max-w-6xl mx-auto">
        {/* Информация о товаре */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Галерея */}
          <div className="lg:w-1/2">
            {/* Основное изображение */}
            <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Миниатюры */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`w-24 h-24 border rounded-md overflow-hidden flex-shrink-0 ${
                      activeImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - изображение ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация и добавление в корзину */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Категория */}
            {product.category && (
              <div className="mb-4">
                <Link
                  to={`/categories/${product.category.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            {/* Цена */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {product.price} ₽/м²
              </p>
            </div>

            {/* Короткое описание */}
            <div className="mb-8">
              <p className="text-gray-600">
                {product.description || "Нет описания для этого товара."}
              </p>
            </div>

            {/* Выбор количества и добавление в корзину */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-gray-700 mr-4">Количество (м²):</span>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center py-1 border-none focus:ring-0"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="bg-blue-600 hover:bg-blue-700 py-2 px-6 flex items-center gap-2"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Добавить в корзину
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      `https://wa.me/79998887766?text=Здравствуйте! Меня интересует товар "${product.name}" за ${product.price} руб/м². Можно получить более подробную информацию?`,
                      "_blank",
                    )
                  }
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Заказать по WhatsApp
                </Button>
              </div>
            </div>

            {/* Преимущества */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="bg-green-100 text-green-600 p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Бесплатный выезд замерщика
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="bg-green-100 text-green-600 p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Монтаж от 1 дня
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="bg-green-100 text-green-600 p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Гарантия 20 лет
                  </span>
                </li>
              </ul>
            </div>

            {/* Дополнительные действия */}
            <div className="flex items-center space-x-4 text-gray-500">
              <button className="flex items-center hover:text-blue-600">
                <Heart className="h-5 w-5 mr-1" />
                <span className="text-sm">В избранное</span>
              </button>
              <button className="flex items-center hover:text-blue-600">
                <Share2 className="h-5 w-5 mr-1" />
                <span className="text-sm">Поделиться</span>
              </button>
            </div>
          </div>
        </div>

        {/* Детальная информация (вкладки) */}
        <div className="mb-16">
          <Tabs
            defaultValue="description"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full border-b border-gray-200 grid grid-cols-3">
              <TabsTrigger value="description" className=" text-base">
                Описание
              </TabsTrigger>
              <TabsTrigger value="specifications" className=" text-base">
                Характеристики
              </TabsTrigger>
              <TabsTrigger value="delivery" className=" text-base">
                Доставка и оплата
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p>
                  {product.description ||
                    "Нет подробного описания для этого товара."}
                </p>

                {/* Демо-описание, если нет реального */}
                {!product.description && (
                  <div>
                    <h3>Преимущества натяжных потолков {product.name}</h3>
                    <p>
                      Натяжные потолки {product.name} — это современное решение
                      для оформления потолка в любом помещении. Они создают
                      идеально ровную поверхность, скрывают все коммуникации и
                      недостатки базового потолка.
                    </p>

                    <h3>Особенности и преимущества:</h3>
                    <ul>
                      <li>Быстрый и чистый монтаж без пыли и мусора</li>
                      <li>Устойчивость к влаге и конденсату</li>
                      <li>Долговечность — срок службы более 15 лет</li>
                      <li>Защита от протечек сверху</li>
                      <li>Широкий выбор цветов и фактур</li>
                      <li>Возможность создания многоуровневых конструкций</li>
                      <li>Совместимость с любыми системами освещения</li>
                    </ul>

                    <h3>Применение</h3>
                    <p>
                      Натяжные потолки {product.name} отлично подходят для жилых
                      помещений, офисов, магазинов, кафе и ресторанов. Материал
                      безопасен для здоровья и имеет все необходимые сертификаты
                      качества.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex border-b border-gray-100 py-3"
                  >
                    <div className="w-1/2 text-gray-500">{spec.name}</div>
                    <div className="w-1/2 font-medium text-gray-900">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Доставка
                  </h3>
                  <div className="flex items-start mb-4">
                    <Truck className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        Бесплатная доставка по Москве и МО
                      </p>
                      <p className="text-gray-600 text-sm">
                        При заказе от 20 м²
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Доставка осуществляется в течение 1-3 рабочих дней после
                    оформления заказа. Точное время доставки согласовывается с
                    менеджером.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Оплата
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Мы принимаем различные способы оплаты для вашего удобства:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Наличными при получении</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Банковской картой при получении</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Безналичный расчет (для юридических лиц)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Возврат и гарантия
                  </h3>
                  <div className="flex items-start mb-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Гарантия 20 лет на все натяжные потолки
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-3">
                    <RefreshCw className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Бесплатная замена при заводском браке
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Похожие товары
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  to={`/products/${relatedProduct.slug}`}
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={
                        relatedProduct.image_url ||
                        "https://via.placeholder.com/300x300?text=Натяжной+потолок"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {relatedProduct.category?.name || "Натяжные потолки"}
                    </p>
                    <div className="font-semibold text-gray-900">
                      {relatedProduct.price} ₽/м²
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
