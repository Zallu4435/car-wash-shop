import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminMarketingFetchers = {
  // Posters
  async getPosterList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      AdminRoutes.POSTERS,
      { params: filters }
    );
    return data.data!;
  },

  async getPosterById(posterId: string): Promise<any> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${AdminRoutes.POSTERS}/${posterId}`
    );
    return data.data!;
  },

  async createPoster(input: any): Promise<any> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      AdminRoutes.POSTERS,
      input
    );
    return data.data!;
  },

  async updatePoster(posterId: string, input: any): Promise<any> {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      `${AdminRoutes.POSTERS}/${posterId}`,
      input
    );
    return data.data!;
  },

  async deletePoster(posterId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.POSTERS}/${posterId}`
    );
    return data.data!;
  },

};
