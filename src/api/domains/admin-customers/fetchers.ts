import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminCustomer,
  AdminCustomerDetail,
  CustomerFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockCustomers: AdminCustomer[] = [
  {
    id: 'CUST001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 98765 43210',
    status: 'active',
    totalOrders: 24,
    totalSpent: 18560,
    joinedDate: '2023-01-15',
    lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'CUST002',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43211',
    status: 'active',
    totalOrders: 18,
    totalSpent: 14200,
    joinedDate: '2023-02-20',
    lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'CUST003',
    name: 'Amit Patel',
    email: 'amit.patel@gmail.com',
    phone: '+91 98765 43212',
    status: 'active',
    totalOrders: 32,
    totalSpent: 25800,
    joinedDate: '2022-11-10',
    lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: 'CUST004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '+91 98765 43213',
    status: 'inactive',
    totalOrders: 8,
    totalSpent: 6400,
    joinedDate: '2023-06-05',
    lastOrderDate: '2023-12-15',
  },
  {
    id: 'CUST005',
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+91 98765 43214',
    status: 'active',
    totalOrders: 15,
    totalSpent: 11250,
    joinedDate: '2023-04-12',
    lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
];

const mockCustomerDetails: Record<string, AdminCustomerDetail> = {
  CUST001: {
    ...mockCustomers[0],
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
  async getCustomerList(filters?: CustomerFilters): Promise<PaginatedResponse<AdminCustomer>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredCustomers = [...mockCustomers];

      // Apply filters
      if (filters?.status) {
        filteredCustomers = filteredCustomers.filter(c => c.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(searchLower)
        );
      }
      if (filters?.fromDate) {
        filteredCustomers = filteredCustomers.filter(c => c.joinedDate >= filters.fromDate!);
      }
      if (filters?.toDate) {
        filteredCustomers = filteredCustomers.filter(c => c.joinedDate <= filters.toDate!);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

      return {
        data: paginatedCustomers,
        total: filteredCustomers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCustomers.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminCustomer>>>(
      AdminRoutes.CUSTOMERS,
      { params: filters }
    );
    return data.data!;
  },

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
