import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface PlatformContact {
    _id?: string;
    phone: string;
    email: string;
    location: string;
    description: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
    };
}

export interface CompanyDetails {
    _id?: string;
    companyName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    gst: string;
    website: string;
}

const ADMIN_SETTINGS_URL = '/admin/settings';

export const adminContactsFetchers = {
    // Platform Contact (Footer)
    async getPlatformContact(): Promise<PlatformContact> {
        const { data } = await apiClient.get<ApiResponse<PlatformContact>>(
            `${ADMIN_SETTINGS_URL}/platform-contact`
        );
        return data.data!;
    },

    async updatePlatformContact(input: Partial<PlatformContact>): Promise<PlatformContact> {
        const { data } = await apiClient.put<ApiResponse<PlatformContact>>(
            `${ADMIN_SETTINGS_URL}/platform-contact`,
            input
        );
        return data.data!;
    },

    // Company Details (Invoice)
    async getCompanyDetails(): Promise<CompanyDetails> {
        const { data } = await apiClient.get<ApiResponse<CompanyDetails>>(
            `${ADMIN_SETTINGS_URL}/company-details`
        );
        return data.data!;
    },

    async updateCompanyDetails(input: Partial<CompanyDetails>): Promise<CompanyDetails> {
        const { data } = await apiClient.put<ApiResponse<CompanyDetails>>(
            `${ADMIN_SETTINGS_URL}/company-details`,
            input
        );
        return data.data!;
    },
};
