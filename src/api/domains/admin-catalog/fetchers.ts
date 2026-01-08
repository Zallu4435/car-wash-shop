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

function mapBackendProductToAdminProduct(p: any): AdminProduct {
  const status: AdminProduct['status'] = p.stock === 0 ? 'out_of_stock' : (p.isAvailable ? 'active' : 'inactive');
  return {
    id: p._id || p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    categoryId: p.categoryId || p.category, // fallback
    price: p.price,
    stock: p.stock,
    status,
    image: p.image,
    images: p.images,
    specifications: p.specifications,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    createdAt: p.createdAt || new Date().toISOString(),
    active: Boolean(p.isAvailable), // backward-compat alias
    comingSoon: Boolean(p.comingSoon),
  } as AdminProduct;
}

export const adminCatalogFetchers = {
  // Services
  async getServiceList(filters?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminService[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      '/services',
      { params: filters }
    );
    const payload: any = data.data;
    const mapped = (payload.data || []).map((s: any): AdminService => {
      // Handle category - can be ObjectId string or populated object
      let categoryValue = s.category;
      let categoryId = s.category;
      if (s.category && typeof s.category === 'object' && s.category !== null) {
        categoryId = s.category._id || s.category.id;
        categoryValue = s.category.name || categoryId;
      }
      return {
        id: s._id || s.id,
        name: s.name,
        description: s.description,
        category: categoryValue,
        categoryId: categoryId,
        pricing: Array.isArray(s.pricing) ? s.pricing : [],
        duration: s.duration,
        status: s.isAvailable ? 'active' : 'inactive',
        image: s.image,
        totalBookings: s.totalBookings || 0,
        rating: typeof s.rating === 'number' ? s.rating : 0,
        createdAt: s.createdAt || new Date().toISOString(),
      };
    });
    return {
      data: mapped,
      total: payload.total,
      page: payload.page,
      pageSize: payload.limit,
      totalPages: payload.totalPages,
    };
  },

  async getServiceById(serviceId: string): Promise<AdminService> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `/services/${serviceId}`
    );
    const s = data.data ?? data;
    // Handle category - can be ObjectId string or populated object
    let categoryValue = s.category;
    let categoryId = s.category;
    if (s.category && typeof s.category === 'object' && s.category !== null) {
      categoryId = s.category._id || s.category.id;
      categoryValue = s.category.name || categoryId;
    }
    return {
      id: s._id || s.id,
      name: s.name,
      description: s.description,
      category: categoryValue,
      categoryId: categoryId,
      pricing: Array.isArray(s.pricing) ? s.pricing : [],
      duration: s.duration,
      status: s.isAvailable ? 'active' : 'inactive',
      isAvailable: Boolean(s.isAvailable),
      image: s.image,
      totalBookings: s.totalBookings || 0,
      rating: typeof s.rating === 'number' ? s.rating : 0,
      createdAt: s.createdAt || new Date().toISOString(),
    };
  },

  async createService(input: CreateServiceInput): Promise<AdminService> {
    const payload = {
      name: input.name,
      description: input.description,
      category: input.categoryId || (input as any).category,
      pricing: input.pricing,
      duration: input.duration,
      isAvailable: (input as any).active ?? true,
      image: (input as any).image,
    };
    const { data } = await apiClient.post<ApiResponse<any>>(
      '/services',
      payload
    );
    const s = data.data;
    // Handle category - can be ObjectId string or populated object
    let categoryValue = s.category;
    let categoryId = s.category;
    if (s.category && typeof s.category === 'object' && s.category !== null) {
      categoryId = s.category._id || s.category.id;
      categoryValue = s.category.name || categoryId;
    }
    return {
      id: s._id || s.id,
      name: s.name,
      description: s.description,
      category: categoryValue,
      categoryId: categoryId,
      pricing: Array.isArray(s.pricing) ? s.pricing : [],
      duration: s.duration,
      status: s.isAvailable ? 'active' : 'inactive',
      image: s.image,
      totalBookings: s.totalBookings || 0,
      rating: typeof s.rating === 'number' ? s.rating : 0,
      createdAt: s.createdAt || new Date().toISOString(),
    };
  },

  async updateService(serviceId: string, input: UpdateServiceInput): Promise<AdminService> {
    const payload = {
      name: input.name,
      description: input.description,
      // Category is not included - it cannot be edited
      pricing: input.pricing,
      duration: input.duration,
      image: (input as any).image,
      isAvailable: (input as any).active ?? (input as any).isAvailable,
    };
    const { data } = await apiClient.put<ApiResponse<any>>(
      `/services/${serviceId}`,
      payload
    );
    const s = data.data;
    // Handle category - can be ObjectId string or populated object
    let categoryValue = s.category;
    let categoryId = s.category;
    if (s.category && typeof s.category === 'object' && s.category !== null) {
      categoryId = s.category._id || s.category.id;
      categoryValue = s.category.name || categoryId;
    }
    return {
      id: s._id || s.id,
      name: s.name,
      description: s.description,
      category: categoryValue,
      categoryId: categoryId,
      pricing: Array.isArray(s.pricing) ? s.pricing : [],
      duration: s.duration,
      status: s.isAvailable ? 'active' : 'inactive',
      image: s.image,
      totalBookings: s.totalBookings || 0,
      rating: typeof s.rating === 'number' ? s.rating : 0,
      createdAt: s.createdAt || new Date().toISOString(),
    };
  },

  async deleteService(serviceId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/services/${serviceId}`
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
    const { data } = await apiClient.get<ApiResponse<any>>(
      '/products',
      { params: filters }
    );
    const payload: any = data.data;
    if (Array.isArray(payload)) {
      // Unexpected flat array; map and wrap with basic pagination
      const mapped = payload.map(mapBackendProductToAdminProduct);
      return {
        data: mapped,
        total: mapped.length,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || mapped.length,
        totalPages: 1,
      };
    }
    // Expected shape from backend service: { data: products[], total, page, limit, totalPages }
    const mapped = (payload.data || []).map(mapBackendProductToAdminProduct);
    return {
      data: mapped,
      total: payload.total,
      page: payload.page,
      pageSize: payload.limit,
      totalPages: payload.totalPages,
    };
  },

  async getProductById(productId: string): Promise<AdminProduct> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `/products/${productId}`
    );
    const raw = data.data ?? data;
    return mapBackendProductToAdminProduct(raw);
  },

  async createProduct(input: any): Promise<AdminProduct> {
    // Accept flexible input (ProductFormInput or CreateProductInput) and map to backend schema
    // Convert empty SKU strings to undefined
    const skuValue = input.sku && input.sku.trim() !== '' ? input.sku.trim() : undefined;

    const payload = {
      name: input.name,
      description: input.description,
      category: input.category || input.categoryId,
      price: input.price,
      comparePrice: input.comparePrice ?? undefined,
      stock: input.stock,
      sku: skuValue,
      image: Array.isArray(input.images) && input.images[0] ? input.images[0] : input.image,
      isAvailable: typeof input.active === 'boolean' ? input.active : undefined,
      featured: typeof input.featured === 'boolean' ? input.featured : undefined,
      comingSoon: typeof input.comingSoon === 'boolean' ? input.comingSoon : undefined,
      specifications: input.specifications,
    };

    const { data } = await apiClient.post<ApiResponse<AdminProduct>>(
      '/products',
      payload
    );
    return data.data!;
  },

  async updateProduct(productId: string, input: any): Promise<AdminProduct> {
    // Build payload with all form fields - include all fields that are in the form
    const payload: any = {
      name: input.name,
      description: input.description,
      category: input.category || input.categoryId,
      price: input.price,
      stock: input.stock,
    };

    // Optional fields - only include if they exist in input
    if (input.comparePrice !== undefined && input.comparePrice !== null) {
      payload.comparePrice = input.comparePrice;
    }
    if (input.sku !== undefined) {
      // Convert empty SKU strings to undefined
      payload.sku = input.sku && input.sku.trim() !== '' ? input.sku.trim() : undefined;
    }
    if (input.images !== undefined || input.image !== undefined) {
      payload.image = Array.isArray(input.images) && input.images.length > 0
        ? input.images[0]
        : (input.image || '');
    }
    if (input.active !== undefined) {
      payload.isAvailable = Boolean(input.active);
    } else if (input.isAvailable !== undefined) {
      payload.isAvailable = Boolean(input.isAvailable);
    }
    if (input.featured !== undefined) {
      payload.featured = Boolean(input.featured);
    }
    if (input.comingSoon !== undefined) {
      payload.comingSoon = Boolean(input.comingSoon);
    }
    if (input.specifications !== undefined) {
      payload.specifications = input.specifications;
    }

    const { data } = await apiClient.put<ApiResponse<AdminProduct>>(
      `/products/${productId}`,
      payload
    );
    return data.data!;
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/products/${productId}`
    );
    return data.data!;
  },

  // Categories
  async getCategoryList(filters?: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminCategory[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      '/categories',
      { params: filters }
    );
    const payload: any = data.data;
    const mapped = (payload.data || []).map((c: any): AdminCategory => ({
      id: c._id || c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      status: c.isActive ? 'active' : 'inactive',
      itemCount: c.itemCount || 0,
      createdAt: c.createdAt || new Date().toISOString(),
      active: Boolean(c.isActive), // backward-compat alias
    }));
    return {
      data: mapped,
      total: payload.total,
      page: payload.page,
      pageSize: payload.limit,
      totalPages: payload.totalPages,
    };
  },

  async getCategoryById(categoryId: string): Promise<AdminCategory> {
    const { data } = await apiClient.get<ApiResponse<any>>(
      `/categories/${categoryId}`
    );
    const c = data.data ?? data;
    return {
      id: c._id || c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      status: c.isActive ? 'active' : 'inactive',
      itemCount: c.itemCount || 0,
      createdAt: c.createdAt || new Date().toISOString(),
      active: Boolean(c.isActive),
    };
  },

  async createCategory(input: CreateCategoryInput): Promise<AdminCategory> {
    const payload = {
      name: input.name,
      type: input.type,
      description: input.description,
      isActive: (input as any).active ?? true,
    };
    const { data } = await apiClient.post<ApiResponse<any>>(
      '/categories',
      payload
    );
    const c = data.data;
    return {
      id: c._id || c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      status: c.isActive ? 'active' : 'inactive',
      itemCount: c.itemCount || 0,
      createdAt: c.createdAt || new Date().toISOString(),
      active: Boolean(c.isActive),
    };
  },

  async updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<AdminCategory> {
    const payload = {
      name: input.name,
      type: (input as any).type,
      description: input.description,
      isActive: (input as any).active ?? (input as any).isActive,
    };
    const { data } = await apiClient.put<ApiResponse<any>>(
      `/categories/${categoryId}`,
      payload
    );
    const c = data.data;
    return {
      id: c._id || c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      status: c.isActive ? 'active' : 'inactive',
      itemCount: c.itemCount || 0,
      createdAt: c.createdAt || new Date().toISOString(),
      active: Boolean(c.isActive),
    };
  },

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/categories/${categoryId}`
    );
    return data.data!;
  },
};
