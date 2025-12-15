import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface Addon {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
    applicableCategories: ('car' | 'bike')[];
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AddonListResponse {
    data: Addon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AddonListParams {
    search?: string;
    status?: 'active' | 'inactive';
    category?: 'car' | 'bike';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CreateAddonInput {
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive?: boolean;
    applicableCategories?: ('car' | 'bike')[];
    image?: string;
}

export interface UpdateAddonInput {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;
    applicableCategories?: ('car' | 'bike')[];
    image?: string;
}

export const adminAddonsFetchers = {
    async getAddons(params: AddonListParams = {}): Promise<AddonListResponse> {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.category) queryParams.append('category', params.category);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const { data } = await apiClient.get<ApiResponse<AddonListResponse>>(
            `/admin/addons?${queryParams.toString()}`
        );
        return data.data!;
    },

    async getAddonById(id: string): Promise<Addon> {
        const { data } = await apiClient.get<ApiResponse<Addon>>(`/admin/addons/${id}`);
        return data.data!;
    },

    async createAddon(input: CreateAddonInput): Promise<Addon> {
        const { data } = await apiClient.post<ApiResponse<Addon>>('/admin/addons', input);
        return data.data!;
    },

    async updateAddon(id: string, input: UpdateAddonInput): Promise<Addon> {
        const { data } = await apiClient.put<ApiResponse<Addon>>(`/admin/addons/${id}`, input);
        return data.data!;
    },

    async deleteAddon(id: string): Promise<{ message: string }> {
        const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/addons/${id}`);
        return data.data!;
    },
};
