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

export const adminCatalogFetchers = {
  // Services
  async getServiceList(): Promise<AdminService[]> {
    const { data } = await apiClient.get<ApiResponse<AdminService[]>>(
      AdminRoutes.SERVICES
    );
    return data.data!;
  },

  async getServiceById(serviceId: string): Promise<AdminService> {
    const { data } = await apiClient.get<ApiResponse<AdminService>>(
      `${AdminRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  async createService(input: CreateServiceInput): Promise<AdminService> {
    const { data } = await apiClient.post<ApiResponse<AdminService>>(
      AdminRoutes.SERVICES,
      input
    );
    return data.data!;
  },

  async updateService(serviceId: string, input: UpdateServiceInput): Promise<AdminService> {
    const { data } = await apiClient.patch<ApiResponse<AdminService>>(
      `${AdminRoutes.SERVICES}/${serviceId}`,
      input
    );
    return data.data!;
  },

  async deleteService(serviceId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${AdminRoutes.SERVICES}/${serviceId}`
    );
    return data.data!;
  },

  // Products
  async getProductList(): Promise<AdminProduct[]> {
    const { data } = await apiClient.get<ApiResponse<AdminProduct[]>>(
      AdminRoutes.PRODUCTS
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
  async getCategoryList(): Promise<AdminCategory[]> {
    const { data } = await apiClient.get<ApiResponse<AdminCategory[]>>(
      AdminRoutes.CATEGORIES
    );
    return data.data!;
  },

  async getCategoryById(categoryId: string): Promise<AdminCategory> {
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
