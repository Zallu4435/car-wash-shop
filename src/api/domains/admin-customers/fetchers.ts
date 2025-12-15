import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  avatar?: string;
  joinedDate: string;
  totalOrders: number;
  totalBookings: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export interface CustomerListResponse {
  data: CustomerListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    total: number;
    active: number;
    suspended: number;
  };
}

export interface CustomerDetail extends CustomerListItem {
  vehicles: {
    id: string;
    brand: string;
    model: string;
    number: string;
    type: string;
    icon?: string;
  }[];
  addresses: {
    id: string;
    type: string;
    address: string;
    isPrimary: boolean;
  }[];
  recentOrders: {
    id: string;
    type: string;
    amount: number;
    status: string;
    date: string;
  }[];
  recentBookings: {
    id: string;
    type: string;
    service: string;
    amount: number;
    status: string;
    date: string;
  }[];
  orderStats: {
    completed: number;
    cancelled: number;
    pending: number;
  };
}

export interface CustomerListParams {
  search?: string;
  status?: 'active' | 'suspended';
  page?: number;
  limit?: number;
}

export const adminCustomersFetchers = {
  async getCustomerList(params: CustomerListParams = {}): Promise<CustomerListResponse> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const { data } = await apiClient.get<ApiResponse<CustomerListResponse>>(
      `/admin/customers?${queryParams.toString()}`
    );
    return data.data!;
  },

  async getCustomerById(customerId: string): Promise<CustomerDetail> {
    const { data } = await apiClient.get<ApiResponse<CustomerDetail>>(
      `/admin/customers/${customerId}`
    );
    return data.data!;
  },

  async updateCustomerStatus(
    customerId: string,
    status: 'active' | 'suspended'
  ): Promise<CustomerListItem> {
    const { data } = await apiClient.patch<ApiResponse<CustomerListItem>>(
      `/admin/customers/${customerId}/status`,
      { status }
    );
    return data.data!;
  },
};
