export interface Service {
  id: string;
  name: string;
  description: string;
  pricing: Array<{ vehicleType: string; price: number }>;
  duration: number | string; // number in minutes, or string like '30 minutes'
  category?: ServiceCategory | string; // Can be object with id/name or string
  categoryId?: string; // Raw category ID/name from backend
  features?: string[];
  isAvailable: boolean;
  image?: string;
  imageUrl?: string;
  averageRating?: number | null;
  totalReviews?: number;
  popular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceFilters {
  category?: string;
  search?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceListResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
