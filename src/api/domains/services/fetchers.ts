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
    const { data } = await apiClient.get<ApiResponse<ServiceListResponse>>(
      CustomerRoutes.SERVICES,
      { params: filters }
    );
    return data.data!;
  },

  async getServiceById(serviceId: string): Promise<Service> {
    const { data } = await apiClient.get<ApiResponse<Service>>(
      `${CustomerRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  async getServiceCategories(): Promise<ServiceCategory[]> {
    const { data } = await apiClient.get<ApiResponse<ServiceCategory[]>>(
      CustomerRoutes.SERVICES_CATEGORIES
    );
    return data.data!;
  },
};
