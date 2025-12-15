import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
    AdminComplaint,
    AdminComplaintFilters,
    ResolveComplaintInput
} from '@/types/admin';

const API_BASE = '/admin/complaints';

export const adminComplaintFetchers = {
    /**
     * Get all complaints with filters and pagination
     */
    async getComplaints(
        filters?: AdminComplaintFilters
    ): Promise<PaginatedResponse<AdminComplaint>> {
        const { data } = await apiClient.get<
            ApiResponse<AdminComplaint[]> & { total: number; page: number; totalPages: number; limit?: number }
        >(API_BASE, { params: filters });

        return {
            data: data.data || [],
            total: data.total || 0,
            page: data.page || 1,
            totalPages: data.totalPages || 0,
            limit: data.limit || filters?.limit || 20,
        };
    },

    /**
     * Get complaint by ID
     */
    async getComplaintById(id: string): Promise<AdminComplaint> {
        const { data } = await apiClient.get<ApiResponse<AdminComplaint>>(
            `${API_BASE}/${id}`
        );
        return data.data!;
    },

    /**
     * Resolve a complaint
     */
    async resolveComplaint(
        id: string,
        input: ResolveComplaintInput
    ): Promise<AdminComplaint> {
        const { data } = await apiClient.patch<ApiResponse<AdminComplaint>>(
            `${API_BASE}/${id}/resolve`,
            input
        );
        return data.data!;
    },
};
