import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Product,
  ProductCategory,
  ProductFilters,
  ProductListResponse,
} from '@/types/product';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockProducts } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const productFetchers = {
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];
      
      if (filters?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters?.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters?.isAvailable !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isAvailable === filters.isAvailable);
      }
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
      
      return {
        data: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
      };
    }
    
    const { data } = await apiClient.get<ApiResponse<ProductListResponse>>(
      CustomerRoutes.PRODUCTS,
      { params: filters }
    );
    return data.data!;
  },

  async getProductById(productId: string): Promise<Product> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const product = mockProducts.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      return product;
    }
    
    const { data } = await apiClient.get<ApiResponse<Product>>(
      `${CustomerRoutes.PRODUCTS}/${productId}`
    );
    return data.data!;
  },

  async getProductCategories(): Promise<ProductCategory[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const categories = Array.from(new Set(mockProducts.map(p => p.category)));
      return categories.map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        name: cat,
        count: mockProducts.filter(p => p.category === cat).length,
      }));
    }
    
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
