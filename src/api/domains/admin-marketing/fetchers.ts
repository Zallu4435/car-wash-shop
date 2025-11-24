import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminBanner,
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

// Map backend banner to frontend AdminBanner format
function mapBackendBannerToAdminBanner(b: any): AdminBanner {
  return {
    id: b._id || b.id,
    title: b.title,
    description: b.description || b.subtitle, // Map subtitle to description if description is missing
    image: b.imageUrl || b.image,
    link: b.ctaLink || b.link,
    position: typeof b.position === 'number' ? b.position : (b.order || 0),
    status: b.active === false ? 'inactive' : 'active',
    validFrom: b.startDate ? new Date(b.startDate).toISOString().split('T')[0] : '',
    validUntil: b.endDate ? new Date(b.endDate).toISOString().split('T')[0] : '',
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    impressions: b.impressions || 0,
    clicks: b.clicks || 0,
    pages: Array.isArray(b.pages) ? b.pages.join(', ') : (b.pages || 'home'),
    startDate: b.startDate ? new Date(b.startDate).toISOString().split('T')[0] : '',
    endDate: b.endDate ? new Date(b.endDate).toISOString().split('T')[0] : '',
    active: b.active !== false,
  };
}

export const adminMarketingFetchers = {
  // Banners
  async getBannerList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminBanner>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      '/admin/banners',
      { params: filters }
    );
    const payload = data.data!;
    return {
      data: payload.data.map(mapBackendBannerToAdminBanner),
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
      totalPages: payload.totalPages,
    };
  },

  async getBannerById(bannerId: string): Promise<AdminBanner> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `/admin/banners/${bannerId}`
    );
    return mapBackendBannerToAdminBanner(data.data!);
  },

  async createBanner(input: CreateBannerInput): Promise<AdminBanner> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      '/admin/banners',
      input
    );
    return mapBackendBannerToAdminBanner(data.data!);
  },

  async updateBanner(bannerId: string, input: UpdateBannerInput): Promise<AdminBanner> {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      `/admin/banners/${bannerId}`,
      input
    );
    return mapBackendBannerToAdminBanner(data.data!);
  },

  async deleteBanner(bannerId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/admin/banners/${bannerId}`
    );
    return data.data!;
  },

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

  // Campaigns
  async getCampaignList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      AdminRoutes.CAMPAIGNS,
      { params: filters }
    );
    return data.data!;
  },

  async getCampaignById(campaignId: string): Promise<any> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`
    );
    return data.data!;
  },

  async createCampaign(input: any): Promise<any> {
    const { data } = await apiClient.post<ApiResponse<any>>(
      AdminRoutes.CAMPAIGNS,
      input
    );
    return data.data!;
  },

  async updateCampaign(campaignId: string, input: any): Promise<any> {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`,
      input
    );
    return data.data!;
  },

  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`
    );
    return data.data!;
  },
};
