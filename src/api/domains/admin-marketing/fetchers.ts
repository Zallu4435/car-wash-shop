import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AdminBanner,
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminMarketingFetchers = {
  // Banners
  async getBannerList(): Promise<AdminBanner[]> {
    const { data } = await apiClient.get<ApiResponse<AdminBanner[]>>(
      AdminRoutes.BANNERS
    );
    return data.data!;
  },

  async getBannerById(bannerId: string): Promise<AdminBanner> {
    const { data } = await apiClient.get<ApiResponse<AdminBanner>>(
      `${AdminRoutes.BANNERS}/${bannerId}`
    );
    return data.data!;
  },

  async createBanner(input: CreateBannerInput): Promise<AdminBanner> {
    const { data } = await apiClient.post<ApiResponse<AdminBanner>>(
      AdminRoutes.BANNERS,
      input
    );
    return data.data!;
  },

  async updateBanner(bannerId: string, input: UpdateBannerInput): Promise<AdminBanner> {
    const { data } = await apiClient.patch<ApiResponse<AdminBanner>>(
      `${AdminRoutes.BANNERS}/${bannerId}`,
      input
    );
    return data.data!;
  },

  async deleteBanner(bannerId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.BANNERS}/${bannerId}`
    );
    return data.data!;
  },

  // Posters (using banners endpoint for now)
  async getPosterList(): Promise<any[]> {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      `${AdminRoutes.BANNERS}/posters`
    );
    return data.data!;
  },

  async deletePoster(posterId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.BANNERS}/posters/${posterId}`
    );
    return data.data!;
  },

  // Campaigns
  async getCampaignList(): Promise<any[]> {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      `${AdminRoutes.BANNERS}/campaigns`
    );
    return data.data!;
  },

  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.BANNERS}/campaigns/${campaignId}`
    );
    return data.data!;
  },
};
