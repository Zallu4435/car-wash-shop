import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServiceListResponse,
} from '@/types/service';
import { CustomerRoutes } from '@/lib/constants/routes';

export const serviceFetchers = {
  async getServices(filters?: ServiceFilters): Promise<ServiceListResponse> {
    const { data } = await apiClient.get<ApiResponse<{
      data: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(CustomerRoutes.SERVICES, { params: filters });

    const resp = data.data!;
    const mapped = resp.data.map((p: any) => {
      // Handle category - can be ObjectId string or populated object
      let categoryId = p.category;
      let categoryName = '';
      if (p.category && typeof p.category === 'object' && p.category !== null) {
        categoryId = p.category._id || p.category.id;
        categoryName = p.category.name || '';
      } else if (p.category) {
        categoryName = String(p.category);
      }

      return {
        id: p._id || p.id,
        name: p.name,
        description: p.description,
        pricing: Array.isArray(p.pricing) ? p.pricing : [],
        // default duration (minutes) if none provided by backend
        duration: typeof p.duration === 'number' ? p.duration : 60,
        averageRating: typeof p.averageRating === 'number' ? p.averageRating : null,
        totalReviews: typeof p.totalReviews === 'number' ? p.totalReviews : 0,
        imageUrl: p.image,
        categoryId: categoryId,
        category: categoryName ? {
          id: String(categoryId || categoryName).toLowerCase().replace(/\s+/g, '-'),
          name: categoryName
        } : undefined,
        isAvailable: typeof p.isAvailable === 'boolean' ? p.isAvailable : true,
      };
    });

    return {
      data: mapped as unknown as Service[],
      total: resp.total,
      page: resp.page,
      limit: resp.limit,
      totalPages: resp.totalPages,
    };
  },

  async getServiceById(serviceId: string): Promise<Service> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${CustomerRoutes.SERVICES}/${serviceId}`
    );
    const p = data.data!;

    // Handle category - can be ObjectId string or populated object
    let categoryId = p.category;
    let categoryName = '';
    if (p.category && typeof p.category === 'object' && p.category !== null) {
      categoryId = p.category._id || p.category.id;
      categoryName = p.category.name || '';
    } else if (p.category) {
      categoryName = String(p.category);
    }

    return {
      id: p._id || p.id,
      name: p.name,
      description: p.description,
      pricing: Array.isArray(p.pricing) ? p.pricing : [],
      duration: typeof p.duration === 'number' ? p.duration : 60,
      averageRating: typeof p.averageRating === 'number' ? p.averageRating : null,
      totalReviews: typeof p.totalReviews === 'number' ? p.totalReviews : 0,
      imageUrl: p.image,
      categoryId: categoryId,
      category: categoryName ? {
        id: String(categoryId || categoryName).toLowerCase().replace(/\s+/g, '-'),
        name: categoryName
      } : undefined,
      isAvailable: typeof p.isAvailable === 'boolean' ? p.isAvailable : true,
    } as unknown as Service;
  },

  async getServiceCategories(): Promise<ServiceCategory[]> {
    const { data } = await apiClient.get<ApiResponse<string[]>>(
      CustomerRoutes.SERVICES_CATEGORIES
    );
    const categories = data.data || [];
    return categories.map((name: string) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name }));
  },

  async getTopReviews(limit: number = 3): Promise<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    serviceName: string;
    createdAt: string;
  }[]> {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      `${CustomerRoutes.SERVICES}/top-reviews`,
      { params: { limit } }
    );
    return data.data || [];
  },

  async getLandingPageStats(): Promise<{
    customerCount: number;
    staffCount: number;
    averageRating: number;
  }> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${CustomerRoutes.SERVICES}/landing-stats`
    );
    return data.data || { customerCount: 0, staffCount: 0, averageRating: 0 };
  },
};
