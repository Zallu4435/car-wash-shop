export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., '30 minutes'
  vehicleType: 'car' | 'bike';
  category: string;
  features: string[];
  isAvailable: boolean;
  image?: string;
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceFilters {
  vehicleType?: 'car' | 'bike';
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceListResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
