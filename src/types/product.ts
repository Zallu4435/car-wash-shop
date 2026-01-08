export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface Product {
  _id: string;

  name: string;
  description: string;
  image: string;
  price: number;
  comparePrice?: number | null;
  brand?: string;
  category: string | Category; // Can be string (backward compat) or populated Category object
  isAvailable: boolean;
  comingSoon?: boolean;
  rating?: number;
  stock?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// Categories are just strings, not objects
export type ProductCategory = string;


export interface ProductFilters {
  category?: string;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
