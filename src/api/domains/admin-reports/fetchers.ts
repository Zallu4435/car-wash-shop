import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  RevenueReport,
  StaffPerformanceReport,
  ServiceReport,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const adminReportsFetchers = {
  async getRevenueReport(fromDate?: string, toDate?: string): Promise<RevenueReport> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalRevenue: 245680,
        revenueByService: [
          { service: 'Premium Car Wash', revenue: 68400, bookings: 342 },
          { service: 'Interior Detailing', revenue: 89600, bookings: 256 },
          { service: 'Full Service', revenue: 87680, bookings: 189 },
        ],
        revenueByProduct: [
          { product: 'Car Shampoo', revenue: 12000, sales: 45 },
          { product: 'Microfiber Cloth', revenue: 23880, sales: 120 },
        ],
        revenueByMonth: [
          { month: '2024-01', revenue: 85600 },
          { month: '2024-02', revenue: 92400 },
          { month: '2024-03', revenue: 67680 },
        ],
        revenueByPaymentMethod: [
          { method: 'Online', amount: 145600, count: 742 },
          { method: 'COD', amount: 78400, count: 398 },
          { method: 'Wallet', amount: 21680, count: 107 },
        ],
      };
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          staffId: 'STF001',
          staffName: 'Ramesh Kumar',
          totalJobs: 342,
          completedJobs: 337,
          cancelledJobs: 5,
          avgRating: 4.8,
          totalEarnings: 125600,
          completionRate: 98.5,
          onTimeRate: 96.2,
        },
        {
          staffId: 'STF002',
          staffName: 'Suresh Patel',
          totalJobs: 256,
          completedJobs: 248,
          cancelledJobs: 8,
          avgRating: 4.6,
          totalEarnings: 98400,
          completionRate: 96.9,
          onTimeRate: 94.5,
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<StaffPerformanceReport[]>>(
      AdminRoutes.REPORTS_STAFF,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },

  async getServiceReport(fromDate?: string, toDate?: string): Promise<ServiceReport[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          serviceId: 'SRV001',
          serviceName: 'Premium Car Wash',
          totalBookings: 342,
          completedBookings: 337,
          cancelledBookings: 5,
          totalRevenue: 204800,
          avgRating: 4.8,
          popularityTrend: 'up',
        },
        {
          serviceId: 'SRV002',
          serviceName: 'Interior Detailing',
          totalBookings: 256,
          completedBookings: 250,
          cancelledBookings: 6,
          totalRevenue: 230400,
          avgRating: 4.7,
          popularityTrend: 'stable',
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<ServiceReport[]>>(
      AdminRoutes.REPORTS_SERVICES,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },
};
