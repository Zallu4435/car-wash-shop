import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServiceListResponse,
} from '@/types/service';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockServices } from '@/mocks/data/customer-mock-data';

// Use mock data for testing
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const serviceFetchers = {
  async getServices(filters?: ServiceFilters): Promise<ServiceListResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredServices = [...mockServices];
      
      if (filters?.category) {
        filteredServices = filteredServices.filter(s => s.category === filters.category);
      }
      if (filters?.search) {
        filteredServices = filteredServices.filter(s => 
          s.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          s.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters?.isAvailable !== undefined) {
        filteredServices = filteredServices.filter(s => s.isAvailable === filters.isAvailable);
      }
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedServices = filteredServices.slice(startIndex, endIndex);
      
      return {
        data: paginatedServices,
        total: filteredServices.length,
        page,
        limit,
        totalPages: Math.ceil(filteredServices.length / limit),
      };
    }
    
    const { data } = await apiClient.get<ApiResponse<ServiceListResponse>>(
      CustomerRoutes.SERVICES,
      { params: filters }
    );
    return data.data!;
  },

  async getServiceById(serviceId: string): Promise<Service> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const service = mockServices.find(s => s.id === serviceId);
      if (!service) throw new Error('Service not found');
      return service;
    }
    
    const { data } = await apiClient.get<ApiResponse<Service>>(
      `${CustomerRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  async getServiceCategories(): Promise<ServiceCategory[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const categories = Array.from(new Set(mockServices.map(s => s.category)));
      return categories.map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        count: mockServices.filter(s => s.category === cat).length,
      }));
    }
    
    const { data } = await apiClient.get<ApiResponse<ServiceCategory[]>>(
      CustomerRoutes.SERVICES_CATEGORIES
    );
    return data.data!;
  },
};
