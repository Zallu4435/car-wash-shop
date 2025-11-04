import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Product,
  ProductCategory,
  ProductFilters,
  ProductListResponse,
} from '@/types/product';
import { CustomerRoutes } from '@/lib/constants/routes';

export const productFetchers = {
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const { data } = await apiClient.get<ApiResponse<ProductListResponse>>(
      CustomerRoutes.PRODUCTS,
      { params: filters }
    );
    return data.data!;
  },

  async getProductById(productId: string): Promise<Product> {
    const { data } = await apiClient.get<ApiResponse<Product>>(
      `${CustomerRoutes.PRODUCTS}/${productId}`
    );
    return data.data!;
  },

  async getProductCategories(): Promise<ProductCategory[]> {
    const { data } = await apiClient.get<ApiResponse<ProductCategory[]>>(
      CustomerRoutes.PRODUCTS_CATEGORIES
    );
    return data.data!;
  },

  async addToFavorites(productId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.PRODUCTS}/${productId}/favorite`
    );
    return data.data!;
  },

  async removeFromFavorites(productId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.PRODUCTS}/${productId}/favorite`
    );
    return data.data!;
  },
};
