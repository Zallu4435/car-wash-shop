import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import { CustomerRoutes } from '@/lib/constants/routes';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceName?: string;
  images?: string[];
}

export interface ServiceReviewsResponse {
  reviews: Review[];
  averageRating: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const reviewFetchers = {
  async getReviewsByServiceId(serviceId: string, page = 1, limit = 50): Promise<ServiceReviewsResponse> {
    const { data } = await apiClient.get<ApiResponse<ServiceReviewsResponse>>(
      `${CustomerRoutes.SERVICES}/${serviceId}/reviews`,
      { params: { page, limit } }
    );
    return data.data!;
  },
};
