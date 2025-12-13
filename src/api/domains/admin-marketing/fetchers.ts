import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

const ADMIN_POSTERS_URL = '/admin/posters';

export const adminMarketingFetchers = {
  // Posters
  async getPosterList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      ADMIN_POSTERS_URL,
      { params: filters }
    );
    return data.data!;
  },

  async getPosterById(posterId: string): Promise<any> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${ADMIN_POSTERS_URL}/${posterId}`
    );
    return data.data!;
  },

  async createPoster(input: any): Promise<any> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      ADMIN_POSTERS_URL,
      input
    );
    return data.data!;
  },

  async updatePoster(posterId: string, input: any): Promise<any> {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      `${ADMIN_POSTERS_URL}/${posterId}`,
      input
    );
    return data.data!;
  },

  async deletePoster(posterId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${ADMIN_POSTERS_URL}/${posterId}`
    );
    return data.data!;
  },

};

