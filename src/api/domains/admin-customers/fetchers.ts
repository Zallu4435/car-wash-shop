import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminCustomer,
  AdminCustomerDetail,
  CustomerFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminCustomersFetchers = {
  async getCustomerList(filters?: CustomerFilters): Promise<PaginatedResponse<AdminCustomer>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminCustomer>>>(
      AdminRoutes.CUSTOMERS,
      { params: filters }
    );
    return data.data!;
  },

  async getCustomerById(customerId: string): Promise<AdminCustomerDetail> {
    const { data } = await apiClient.get<ApiResponse<AdminCustomerDetail>>(
      AdminRoutes.CUSTOMER_DETAIL(customerId)
    );
    return data.data!;
  },

  async updateCustomerStatus(
    customerId: string,
    status: 'active' | 'inactive' | 'blocked'
  ): Promise<AdminCustomerDetail> {
    const { data } = await apiClient.patch<ApiResponse<AdminCustomerDetail>>(
      AdminRoutes.CUSTOMER_DETAIL(customerId),
      { status }
    );
    return data.data!;
  },
};
