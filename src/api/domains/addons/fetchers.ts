import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface PublicAddon {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    applicableCategories: ('car' | 'bike')[];
    image?: string;
}

export const addonsFetchers = {
    /**
     * Get active add-ons for customers
     * @param category - Optional filter by vehicle category ('car' | 'bike')
     */
    async getActiveAddons(category?: string): Promise<PublicAddon[]> {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category);

        const url = `/addons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const { data } = await apiClient.get<ApiResponse<PublicAddon[]>>(url);
        return data.data || [];
    },
};
