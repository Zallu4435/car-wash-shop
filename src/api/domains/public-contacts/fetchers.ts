import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface PublicPlatformContact {
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

export interface PublicCompanyDetails {
    companyName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    gst: string;
    website: string;
}

export const publicContactsFetchers = {
    async getPlatformContact(): Promise<PublicPlatformContact> {
        const { data } = await apiClient.get<ApiResponse<PublicPlatformContact>>(
            '/platform-contact'
        );
        return data.data!;
    },

    async getCompanyDetails(): Promise<PublicCompanyDetails> {
        const { data } = await apiClient.get<ApiResponse<PublicCompanyDetails>>(
            '/company-details'
        );
        return data.data!;
    },
};
