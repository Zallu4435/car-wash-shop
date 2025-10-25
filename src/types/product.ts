export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  active: boolean;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  active: boolean;
  createdAt: string;
}
