import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { StaffDashboardSummary, StaffJob } from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffDashboardFetchers = {
  async getDashboardSummary(): Promise<StaffDashboardSummary> {
    const { data } = await apiClient.get<ApiResponse<StaffDashboardSummary>>(
      StaffRoutes.DASHBOARD + '/summary'
    );
    return data.data!;
  },

  async getUpcomingJobs(): Promise<StaffJob[]> {
    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.JOBS + '/upcoming'
    );
    return data.data!;
  },
};
