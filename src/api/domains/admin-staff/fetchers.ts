import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminStaff,
  AdminStaffDetail,
  CreateStaffInput,
  UpdateStaffInput,
  StaffFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminStaffFetchers = {
  async getStaffList(filters?: StaffFilters): Promise<PaginatedResponse<AdminStaff>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminStaff>>>(
      AdminRoutes.STAFF,
      { params: filters }
    );
    return data.data!;
  },

  async getStaffById(staffId: string): Promise<AdminStaffDetail> {
    const { data } = await apiClient.get<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF_DETAIL(staffId)
    );
    return data.data!;
  },

  async createStaff(input: CreateStaffInput): Promise<AdminStaffDetail> {
    const { data } = await apiClient.post<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF,
      input
    );
    return data.data!;
  },

  async updateStaff(staffId: string, input: UpdateStaffInput): Promise<AdminStaffDetail> {
    const { data } = await apiClient.patch<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF_DETAIL(staffId),
      input
    );
    return data.data!;
  },

  async deleteStaff(staffId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      AdminRoutes.STAFF_DETAIL(staffId)
    );
    return data.data!;
  },
};
