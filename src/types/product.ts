import { Category } from "./category";

export interface ProductSpecification {
  id: number;
  product_id: number;
  name: string;
  value: string;
}

export interface ProductGalleryImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  price_type: "square_meter" | "linear_meter" | "piece";
  image_url: string | null;
  category_id: number;
  stock: number;
  category_ids: string | null;
  category?: Category;
  specifications?: ProductSpecification[];
  is_featured: boolean;
  gallery_images?: ProductGalleryImage[];
  created_at: string;
  updated_at: string;
}
