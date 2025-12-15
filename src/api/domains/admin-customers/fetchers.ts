import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AdminCustomerDetail,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const mockCustomerDetails: Record<string, AdminCustomerDetail> = {
  CUST001: {
    id: 'CUST001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 98765 43210',
    status: 'active',
    totalOrders: 24,
    totalSpent: 18560,
    joinedDate: '2023-01-15',
    lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    addresses: [
      {
        id: 'ADDR001',
        type: 'Home',
        address: '123, MG Road, Koramangala, Bangalore - 560034',
        isPrimary: true,
      },
      {
        id: 'ADDR002',
        type: 'Office',
        address: '456, Brigade Road, Indiranagar, Bangalore - 560038',
        isPrimary: false,
      },
    ],
    vehicles: [
      {
        id: 'VEH001',
        brand: 'Honda',
        model: 'City',
        number: 'KA-01-AB-1234',
        type: 'Sedan',
      },
      {
        id: 'VEH002',
        brand: 'Maruti',
        model: 'Swift',
        number: 'KA-01-CD-5678',
        type: 'Hatchback',
      },
    ],
    recentOrders: [
      {
        id: 'ORD101',
        service: 'Premium Car Wash',
        amount: 599,
        status: 'completed',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ORD102',
        service: 'Interior Detailing',
        amount: 899,
        status: 'completed',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    orderStats: {
      completed: 22,
      cancelled: 1,
      pending: 1,
    },
  },
};

export const adminCustomersFetchers = {
  async getCustomerById(customerId: string): Promise<AdminCustomerDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const customerDetail = mockCustomerDetails[customerId];
      if (!customerDetail) {
        throw new Error('Customer not found');
      }
      return customerDetail;
    }

    const { data } = await apiClient.get<ApiResponse<AdminCustomerDetail>>(
      AdminRoutes.CUSTOMER_DETAIL(customerId)
    );
    return data.data!;
  },

  async updateCustomerStatus(
    customerId: string,
    status: 'active' | 'inactive' | 'blocked'
  ): Promise<AdminCustomerDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const customerDetail = mockCustomerDetails[customerId];
      if (!customerDetail) {
        throw new Error('Customer not found');
      }
      return { ...customerDetail, status };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminCustomerDetail>>(
      AdminRoutes.CUSTOMER_DETAIL(customerId),
      { status }
    );
    return data.data!;
  },
};
