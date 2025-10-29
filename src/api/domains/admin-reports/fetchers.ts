import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  RevenueReport,
  StaffPerformanceReport,
  ServiceReport,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminReportsFetchers = {
  async getRevenueReport(fromDate?: string, toDate?: string): Promise<RevenueReport> {
    const { data } = await apiClient.get<ApiResponse<RevenueReport>>(
      AdminRoutes.REPORTS,
      { params: { type: 'revenue', fromDate, toDate } }
    );
    return data.data!;
  },

  async getStaffPerformanceReport(
    fromDate?: string,
    toDate?: string
  ): Promise<StaffPerformanceReport[]> {
    const { data } = await apiClient.get<ApiResponse<StaffPerformanceReport[]>>(
      AdminRoutes.REPORTS_STAFF,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },

  async getServiceReport(fromDate?: string, toDate?: string): Promise<ServiceReport[]> {
    const { data } = await apiClient.get<ApiResponse<ServiceReport[]>>(
      AdminRoutes.REPORTS_SERVICES,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },
};
