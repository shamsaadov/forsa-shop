import React from "react";
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Дефолтное изображение, если нет изображения категории
  const defaultImage = "/no_photo.png";

  return (
    <Link to={`/categories/${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full">
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={category.image_url || defaultImage}
            alt={category.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-gray-500 text-sm line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
