import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface PublicVehicleCategory {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    displayOrder: number;
}

export interface PublicVehicleType {
    _id: string;
    category: string;
    bodyType: string;
    name: string;
    icon: string;
    displayOrder: number;
}

const PUBLIC_URL = '/vehicle-types';

export const publicVehicleTypesFetchers = {
    async getActiveCategories(): Promise<PublicVehicleCategory[]> {
        const { data } = await apiClient.get<ApiResponse<PublicVehicleCategory[]>>(
            `${PUBLIC_URL}/categories`
        );
        return data.data || [];
    },

    async getActiveVehicleTypes(category?: string): Promise<PublicVehicleType[]> {
        const params = category ? { category } : undefined;
        const { data } = await apiClient.get<ApiResponse<PublicVehicleType[]>>(
            PUBLIC_URL,
            { params }
        );
        return data.data || [];
    },
};
