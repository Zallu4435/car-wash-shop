import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminBanner,
  CreateBannerInput,
  UpdateBannerInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
// Mock Banners
const mockBanners: AdminBanner[] = [
  {
    id: 'BNR001',
    title: 'Summer Special Offer',
    description: 'Get 50% off on all premium services',
    image: '/images/banners/summer-special.jpg',
    link: '/services',
    pages: 'Home, Services',
    position: 1,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    validFrom: '2024-01-01',
    validUntil: '2024-06-30',
    status: 'active',
    createdAt: '2024-01-01',
    impressions: 15000,
    clicks: 450,
  },
  {
    id: 'BNR002',
    title: 'New Year Sale',
    description: 'Flat ₹100 off on first booking',
    image: '/images/banners/new-year.jpg',
    link: '/book-now',
    pages: 'Home',
    position: 2,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    validFrom: '2024-01-01',
    validUntil: '2024-01-31',
    status: 'active',
    createdAt: '2024-01-01',
    impressions: 8000,
    clicks: 320,
  },
  {
    id: 'BNR003',
    title: 'Premium Detailing',
    description: 'Experience luxury car care',
    image: '/images/banners/premium.jpg',
    link: '/services/detailing',
    pages: 'Services',
    position: 3,
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    validFrom: '2024-02-01',
    validUntil: '2024-12-31',
    status: 'inactive',
    createdAt: '2024-02-01',
    impressions: 5000,
    clicks: 100,
  },
  {
    id: 'BNR004',
    title: 'Weekend Discount',
    description: 'Special weekend rates',
    image: '/images/banners/weekend.jpg',
    link: '/book',
    pages: 'Home, Book',
    position: 4,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    validFrom: '2024-03-01',
    validUntil: '2024-12-31',
    status: 'active',
    createdAt: '2024-03-01',
    impressions: 12000,
    clicks: 380,
  },
  {
    id: 'BNR005',
    title: 'Monsoon Care Package',
    description: 'Protect your car this monsoon',
    image: '/images/banners/monsoon.jpg',
    link: '/services',
    pages: 'Services',
    position: 5,
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    validFrom: '2024-06-01',
    validUntil: '2024-09-30',
    status: 'inactive',
    createdAt: '2024-06-01',
    impressions: 3000,
    clicks: 90,
  },
];

// Mock Posters
const mockPosters: any[] = [
  {
    id: 'PST001',
    title: 'Grand Opening Poster',
    location: 'Main Entrance',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    views: 25000,
  },
  {
    id: 'PST002',
    title: 'Service Menu Board',
    location: 'Waiting Area',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    views: 18000,
  },
  {
    id: 'PST003',
    title: 'Safety Guidelines',
    location: 'Service Bay',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    views: 15000,
  },
  {
    id: 'PST004',
    title: 'Loyalty Program',
    location: 'Reception',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    status: 'inactive',
    views: 8000,
  },
];

// Mock Campaigns
const mockCampaigns: any[] = [
  {
    id: 'CMP001',
    name: 'Summer Sale 2024',
    type: 'Seasonal',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    budget: 50000,
    spent: 32000,
    impressions: 150000,
    clicks: 4500,
    conversions: 320,
  },
  {
    id: 'CMP002',
    name: 'New Customer Acquisition',
    type: 'Acquisition',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 100000,
    spent: 45000,
    impressions: 200000,
    clicks: 6000,
    conversions: 450,
  },
  {
    id: 'CMP003',
    name: 'Referral Program',
    type: 'Referral',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    budget: 30000,
    spent: 18000,
    impressions: 80000,
    clicks: 2400,
    conversions: 180,
  },
  {
    id: 'CMP004',
    name: 'Festival Special',
    type: 'Seasonal',
    status: 'inactive',
    startDate: '2024-10-01',
    endDate: '2024-11-15',
    budget: 40000,
    spent: 5000,
    impressions: 30000,
    clicks: 900,
    conversions: 65,
  },
];

export const adminMarketingFetchers = {
  // Banners
  async getBannerList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminBanner>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredBanners = [...mockBanners];

      // Apply filters
      if (filters?.status) {
        filteredBanners = filteredBanners.filter(b => b.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredBanners = filteredBanners.filter(b =>
          b.title.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBanners = filteredBanners.slice(startIndex, endIndex);

      return {
        data: paginatedBanners,
        total: filteredBanners.length,
        page,
        limit,
        totalPages: Math.ceil(filteredBanners.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminBanner>>>(
      AdminRoutes.BANNERS,
      { params: filters }
    );
    return data.data!;
  },

  async getBannerById(bannerId: string): Promise<AdminBanner> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const banner = mockBanners.find(b => b.id === bannerId);
      if (!banner) throw new Error('Banner not found');
      return banner;
    }

    const { data } = await apiClient.get<ApiResponse<AdminBanner>>(
      `${AdminRoutes.BANNERS}/${bannerId}`
    );
    return data.data!;
  },

  async createBanner(input: CreateBannerInput): Promise<AdminBanner> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `BNR${String(mockBanners.length + 1).padStart(3, '0')}`,
        title: input.title,
        description: input.description || '',
        image: input.image,
        link: input.link || '',
        status: 'active',
        position: input.position,
        validFrom: input.validFrom,
        validUntil: input.validUntil,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    const { data } = await apiClient.post<ApiResponse<AdminBanner>>(
      AdminRoutes.BANNERS,
      input
    );
    return data.data!;
  },

  async updateBanner(bannerId: string, input: UpdateBannerInput): Promise<AdminBanner> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const banner = mockBanners.find(b => b.id === bannerId);
      if (!banner) throw new Error('Banner not found');
      return {
        ...banner,
        ...input,
      };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminBanner>>(
      `${AdminRoutes.BANNERS}/${bannerId}`,
      input
    );
    return data.data!;
  },

  async deleteBanner(bannerId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Banner deleted successfully' };
    }

    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.BANNERS}/${bannerId}`
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredPosters = [...mockPosters];

      // Apply filters
      if (filters?.status) {
        filteredPosters = filteredPosters.filter(p => p.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPosters = filteredPosters.filter(p =>
          p.title.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosters = filteredPosters.slice(startIndex, endIndex);

      return {
        data: paginatedPosters,
        total: filteredPosters.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPosters.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      AdminRoutes.POSTERS,
      { params: filters }
    );
    return data.data!;
  },

  async getPosterById(posterId: string): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const poster = mockPosters.find(p => p.id === posterId);
      if (!poster) throw new Error('Poster not found');
      return poster;
    }

    const { data } = await apiClient.get<ApiResponse<any>>(
      `${AdminRoutes.POSTERS}/${posterId}`
    );
    return data.data!;
  },

  async createPoster(input: any): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `PST${String(mockPosters.length + 1).padStart(3, '0')}`,
        ...input,
        views: 0,
      };
    }

    const { data } = await apiClient.post<ApiResponse<any>>(
      AdminRoutes.POSTERS,
      input
    );
    return data.data!;
  },

  async updatePoster(posterId: string, input: any): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const poster = mockPosters.find(p => p.id === posterId);
      if (!poster) throw new Error('Poster not found');
      return {
        ...poster,
        ...input,
      };
    }

    const { data } = await apiClient.patch<ApiResponse<any>>(
      `${AdminRoutes.POSTERS}/${posterId}`,
      input
    );
    return data.data!;
  },

  async deletePoster(posterId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Poster deleted successfully' };
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredCampaigns = [...mockCampaigns];

      // Apply filters
      if (filters?.status) {
        filteredCampaigns = filteredCampaigns.filter(c => c.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(c =>
          c.name.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

      return {
        data: paginatedCampaigns,
        total: filteredCampaigns.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCampaigns.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      AdminRoutes.CAMPAIGNS,
      { params: filters }
    );
    return data.data!;
  },

  async getCampaignById(campaignId: string): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');
      return campaign;
    }

    const { data } = await apiClient.get<ApiResponse<any>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`
    );
    return data.data!;
  },

  async createCampaign(input: any): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `CMP${String(mockCampaigns.length + 1).padStart(3, '0')}`,
        ...input,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
      };
    }

    const { data } = await apiClient.post<ApiResponse<any>>(
      AdminRoutes.CAMPAIGNS,
      input
    );
    return data.data!;
  },

  async updateCampaign(campaignId: string, input: any): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');
      return {
        ...campaign,
        ...input,
      };
    }

    const { data } = await apiClient.patch<ApiResponse<any>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`,
      input
    );
    return data.data!;
  },

  async deleteCampaign(campaignId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Campaign deleted successfully' };
    }

    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.CAMPAIGNS}/${campaignId}`
    );
    return data.data!;
  },
};
