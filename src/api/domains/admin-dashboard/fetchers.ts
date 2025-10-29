import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { AdminDashboardSummary } from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminDashboardFetchers = {
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    const { data } = await apiClient.get<ApiResponse<AdminDashboardSummary>>(
      AdminRoutes.DASHBOARD + '/summary'
    );
    return data.data!;
  },
};
