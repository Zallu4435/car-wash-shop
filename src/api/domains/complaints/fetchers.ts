import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
    Complaint,
    CreateComplaintInput,
    CanFileComplaintResult
} from '@/types/complaint';

const API_BASE = '/complaints';

export const complaintFetchers = {
    /**
     * Create a new complaint
     */
    async createComplaint(input: CreateComplaintInput): Promise<Complaint> {
        const { data } = await apiClient.post<ApiResponse<Complaint>>(
            API_BASE,
            input
        );
        return data.data!;
    },

    /**
     * Get complaint for a specific order/booking
     */
    async getComplaintByReference(
        referenceType: 'booking' | 'productOrder',
        referenceId: string
    ): Promise<Complaint | null> {
        const { data } = await apiClient.get<ApiResponse<Complaint | null>>(
            `${API_BASE}/${referenceType}/${referenceId}`
        );
        return data.data ?? null;
    },

    /**
     * Check if user can file a complaint
     */
    async canFileComplaint(
        referenceType: 'booking' | 'productOrder',
        referenceId: string
    ): Promise<CanFileComplaintResult> {
        const { data } = await apiClient.get<ApiResponse<CanFileComplaintResult>>(
            `${API_BASE}/can-file/${referenceType}/${referenceId}`
        );
        return data.data!;
    },
};
