import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { StaffDashboardSummary, StaffJob } from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockDashboardSummary: StaffDashboardSummary = {
  todayJobs: 8,
  weekJobs: 42,
  earnings: 15680,
  rating: 4.8,
  statsTrends: {
    todayJobs: '+2',
    weekJobs: '+12%',
    earnings: '+₹2,340',
    rating: '+0.2',
  },
};

const mockUpcomingJobs: StaffJob[] = [
  {
    id: 'JOB001',
    service: 'Premium Car Wash',
    customer: 'Rajesh Kumar',
    time: '10:00 AM',
    datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Koramangala, Bangalore',
    status: 'confirmed',
    amount: 599,
  },
  {
    id: 'JOB002',
    service: 'Interior Detailing',
    customer: 'Priya Sharma',
    time: '12:30 PM',
    datetime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
    location: 'Indiranagar, Bangalore',
    status: 'confirmed',
    amount: 899,
  },
  {
    id: 'JOB003',
    service: 'Bike Wash',
    customer: 'Amit Patel',
    time: '2:00 PM',
    datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    location: 'HSR Layout, Bangalore',
    status: 'pending',
    amount: 199,
  },
  {
    id: 'JOB004',
    service: 'Full Service',
    customer: 'Sneha Reddy',
    time: '4:30 PM',
    datetime: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(),
    location: 'Whitefield, Bangalore',
    status: 'confirmed',
    amount: 1299,
  },
];

export const staffDashboardFetchers = {
  async getDashboardSummary(): Promise<StaffDashboardSummary> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardSummary;
    }

    const { data } = await apiClient.get<ApiResponse<StaffDashboardSummary>>(
      StaffRoutes.DASHBOARD + '/summary'
    );
    return data.data!;
  },

  async getUpcomingJobs(): Promise<StaffJob[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUpcomingJobs;
    }

    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.JOBS + '/upcoming'
    );
    return data.data!;
  },
};
