import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AdminService,
  CreateServiceInput,
  UpdateServiceInput,
  AdminProduct,
  CreateProductInput,
  UpdateProductInput,
  AdminCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';
import { mockServices, mockProducts, mockCategories } from './mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const adminCatalogFetchers = {
  // Services
  async getServiceList(filters?: { 
    search?: string; 
    status?: string; 
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminService[]; total: number; page: number; pageSize: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...mockServices];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(searchLower) ||
          s.category.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.status) {
        filtered = filtered.filter(s => s.status === filters.status);
      }
      
      if (filters?.category) {
        filtered = filtered.filter(s => s.category === filters.category);
      }
      
      // Pagination
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    const { data } = await apiClient.get<ApiResponse<{ data: AdminService[]; total: number; page: number; pageSize: number; totalPages: number }>>(
      AdminRoutes.SERVICES,
      { params: filters }
    );
    return data.data!;
  },

  async getServiceById(serviceId: string): Promise<AdminService> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const service = mockServices.find(s => s.id === serviceId);
      if (!service) throw new Error('Service not found');
      return service;
    }

    const { data } = await apiClient.get<ApiResponse<AdminService>>(
      `${AdminRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  async createService(input: CreateServiceInput): Promise<AdminService> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `SRV${String(mockServices.length + 1).padStart(3, '0')}`,
        name: input.name,
        description: input.description,
        category: 'New Service',
        price: input.price,
        duration: input.duration,
        status: 'active',
        totalBookings: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    const { data } = await apiClient.post<ApiResponse<AdminService>>(
      AdminRoutes.SERVICES,
      input
    );
    return data.data!;
  },

  async updateService(serviceId: string, input: UpdateServiceInput): Promise<AdminService> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const service = mockServices.find(s => s.id === serviceId);
      if (!service) throw new Error('Service not found');
      return { ...service, ...input };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminService>>(
      `${AdminRoutes.SERVICES}/${serviceId}`,
      input
    );
    return data.data!;
  },

  async deleteService(serviceId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Service deleted successfully' };
    }

    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  // Products
  async getProductList(filters?: { 
    search?: string; 
    status?: string; 
    category?: string; 
    stock?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminProduct[]; total: number; page: number; pageSize: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...mockProducts];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.status) {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      
      if (filters?.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      
      if (filters?.stock) {
        filtered = filtered.filter(p => {
          if (filters.stock === 'in-stock') return p.stock > 10;
          if (filters.stock === 'low-stock') return p.stock > 0 && p.stock <= 10;
          if (filters.stock === 'out-of-stock') return p.stock === 0;
          return true;
        });
      }
      
      // Pagination
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    const { data } = await apiClient.get<ApiResponse<{ data: AdminProduct[]; total: number; page: number; pageSize: number; totalPages: number }>>(
      AdminRoutes.PRODUCTS,
      { params: filters }
    );
    return data.data!;
  },

  async getProductById(productId: string): Promise<AdminProduct> {
    const { data } = await apiClient.get<ApiResponse<AdminProduct>>(
      `${AdminRoutes.PRODUCTS}/${productId}`
    );
    return data.data!;
  },

  async createProduct(input: CreateProductInput): Promise<AdminProduct> {
    const { data } = await apiClient.post<ApiResponse<AdminProduct>>(
      AdminRoutes.PRODUCTS,
      input
    );
    return data.data!;
  },

  async updateProduct(productId: string, input: UpdateProductInput): Promise<AdminProduct> {
    const { data } = await apiClient.patch<ApiResponse<AdminProduct>>(
      `${AdminRoutes.PRODUCTS}/${productId}`,
      input
    );
    return data.data!;
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.PRODUCTS}/${productId}`
    );
    return data.data!;
  },

  // Categories
  async getCategoryList(filters?: { 
    search?: string; 
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminCategory[]; total: number; page: number; pageSize: number; totalPages: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...mockCategories];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      
      // Pagination
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages,
      };
    }

    const { data } = await apiClient.get<ApiResponse<{ data: AdminCategory[]; total: number; page: number; pageSize: number; totalPages: number }>>(
      AdminRoutes.CATEGORIES,
      { params: filters }
    );
    return data.data!;
  },

  async getCategoryById(categoryId: string): Promise<AdminCategory> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const category = mockCategories.find(c => c.id === categoryId);
      if (!category) throw new Error('Category not found');
      return category;
    }

    const { data } = await apiClient.get<ApiResponse<AdminCategory>>(
      `${AdminRoutes.CATEGORIES}/${categoryId}`
    );
    return data.data!;
  },

  async createCategory(input: CreateCategoryInput): Promise<AdminCategory> {
    const { data } = await apiClient.post<ApiResponse<AdminCategory>>(
      AdminRoutes.CATEGORIES,
      input
    );
    return data.data!;
  },

  async updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<AdminCategory> {
    const { data } = await apiClient.patch<ApiResponse<AdminCategory>>(
      `${AdminRoutes.CATEGORIES}/${categoryId}`,
      input
    );
    return data.data!;
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.CATEGORIES}/${categoryId}`
    );
    return data.data!;
  },
};
