import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { StaffPaymentSummary } from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffPaymentsFetchers = {
  async getPaymentSummary(): Promise<StaffPaymentSummary> {
    const { data } = await apiClient.get<ApiResponse<StaffPaymentSummary>>(
      StaffRoutes.PAYMENTS + '/summary'
    );
    return data.data!;
  },
};
