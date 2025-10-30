import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { StaffPaymentSummary } from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockPaymentSummary: StaffPaymentSummary = {
  totalEarnings: 45680,
  thisWeek: 8920,
  pendingPayments: 2340,
  history: [
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), amount: 1798, jobId: 'JOB101', service: 'Premium Car Wash + Interior Detailing' },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), amount: 1498, jobId: 'JOB102', service: 'Full Service + Waxing' },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 1299, jobId: 'JOB103', service: 'Full Service' },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 899, jobId: 'JOB104', service: 'Interior Detailing' },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), amount: 599, jobId: 'JOB105', service: 'Premium Car Wash' },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), amount: 399, jobId: 'JOB106', service: 'Express Wash' },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), amount: 199, jobId: 'JOB107', service: 'Bike Wash' },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), amount: 799, jobId: 'JOB108', service: 'Interior + Exterior Detailing' },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), amount: 599, jobId: 'JOB109', service: 'Premium Car Wash' },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), amount: 399, jobId: 'JOB110', service: 'Express Wash' },
  ],
};

export const staffPaymentsFetchers = {
  async getPaymentSummary(): Promise<StaffPaymentSummary> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPaymentSummary;
    }

    const { data } = await apiClient.get<ApiResponse<StaffPaymentSummary>>(
      StaffRoutes.PAYMENTS + '/summary'
    );
    return data.data!;
  },
};
