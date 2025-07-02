import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Дефолтное изображение, если нет изображения товара
  const defaultImage = "/no_photo.png";

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Получение текста типа цены
  const getPriceTypeText = (type: string) => {
    switch (type) {
      case "square_meter":
        return "за м²";
      case "linear_meter":
        return "за м.п.";
      case "piece":
        return "за шт.";
      default:
        return "";
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url || defaultImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="flex-grow p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-gray-500 mt-2 line-clamp-2 text-sm">
            {product.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg text-blue-600">
            {formatPrice(product.price)}
          </p>
          <p className="text-sm text-gray-500">
            {getPriceTypeText(product.price_type)}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/products/${product.slug}`}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 bg-blue-600 hover:bg-blue-700"
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
