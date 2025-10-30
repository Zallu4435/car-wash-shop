import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { AdminDashboardSummary } from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockDashboardSummary: AdminDashboardSummary = {
  totalRevenue: 245680,
  totalOrders: 1247,
  totalCustomers: 856,
  totalStaff: 24,
  revenueGrowth: '+12.5%',
  ordersGrowth: '+8.3%',
  customersGrowth: '+15.2%',
  staffGrowth: '+4.2%',
  recentOrders: [
    {
      id: 'ORD001',
      customer: 'Rajesh Kumar',
      amount: 1299,
      status: 'completed',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD002',
      customer: 'Priya Sharma',
      amount: 899,
      status: 'in_progress',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD003',
      customer: 'Amit Patel',
      amount: 599,
      status: 'pending',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD004',
      customer: 'Sneha Reddy',
      amount: 1499,
      status: 'completed',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ORD005',
      customer: 'Vikram Singh',
      amount: 799,
      status: 'completed',
      date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
  ],
  topServices: [
    {
      id: 'SRV001',
      name: 'Premium Car Wash',
      bookings: 342,
      revenue: 204800,
    },
    {
      id: 'SRV002',
      name: 'Interior Detailing',
      bookings: 256,
      revenue: 230400,
    },
    {
      id: 'SRV003',
      name: 'Full Service',
      bookings: 189,
      revenue: 245110,
    },
    {
      id: 'SRV004',
      name: 'Express Wash',
      bookings: 428,
      revenue: 171200,
    },
    {
      id: 'SRV005',
      name: 'Bike Wash',
      bookings: 312,
      revenue: 62400,
    },
  ],
};

export const adminDashboardFetchers = {
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardSummary;
    }

    const { data } = await apiClient.get<ApiResponse<AdminDashboardSummary>>(
      AdminRoutes.DASHBOARD + '/summary'
    );
    return data.data!;
  },
};
