import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface VehicleCategory {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleType {
    _id: string;
    category: string;
    bodyType: string;
    name: string;
    icon: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleCategoryInput {
    name: string;
    slug?: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface VehicleTypeInput {
    category: string;
    bodyType: string;
    name: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface CategoryWithTypes {
    category: VehicleCategory;
    types: VehicleType[];
}

const ADMIN_URL = '/admin/vehicle-types';

export const adminVehicleTypesFetchers = {
    // Categories
    async getCategories(): Promise<VehicleCategory[]> {
        const { data } = await apiClient.get<ApiResponse<VehicleCategory[]>>(
            `${ADMIN_URL}/categories`
        );
        return data.data || [];
    },

    async getCategoryWithTypes(id: string): Promise<CategoryWithTypes> {
        const { data } = await apiClient.get<ApiResponse<CategoryWithTypes>>(
            `${ADMIN_URL}/categories/${id}`
        );
        return data.data!;
    },

    async createCategory(input: VehicleCategoryInput): Promise<VehicleCategory> {
        const { data } = await apiClient.post<ApiResponse<VehicleCategory>>(
            `${ADMIN_URL}/categories`,
            input
        );
        return data.data!;
    },

    async updateCategory(id: string, input: Partial<VehicleCategoryInput>): Promise<VehicleCategory> {
        const { data } = await apiClient.put<ApiResponse<VehicleCategory>>(
            `${ADMIN_URL}/categories/${id}`,
            input
        );
        return data.data!;
    },

    async deleteCategory(id: string): Promise<{ message: string }> {
        const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
            `${ADMIN_URL}/categories/${id}`
        );
        return data.data!;
    },

    // Types
    async getVehicleTypes(category?: string): Promise<VehicleType[]> {
        const params = category ? { category } : undefined;
        const { data } = await apiClient.get<ApiResponse<{ data: VehicleType[] }>>(
            ADMIN_URL,
            { params }
        );
        return data.data?.data || [];
    },

    async createVehicleType(input: VehicleTypeInput): Promise<VehicleType> {
        const { data } = await apiClient.post<ApiResponse<VehicleType>>(
            ADMIN_URL,
            input
        );
        return data.data!;
    },

    async updateVehicleType(id: string, input: Partial<VehicleTypeInput>): Promise<VehicleType> {
        const { data } = await apiClient.put<ApiResponse<VehicleType>>(
            `${ADMIN_URL}/${id}`,
            input
        );
        return data.data!;
    },

    async deleteVehicleType(id: string): Promise<{ message: string }> {
        const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
            `${ADMIN_URL}/${id}`
        );
        return data.data!;
    },

    async countAffectedServices(bodyType: string): Promise<{ count: number }> {
        const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
            `${ADMIN_URL}/affected-services/${encodeURIComponent(bodyType)}`
        );
        return data.data!;
    },
};
