import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminOrder,
  AdminOrderDetail,
  UpdateOrderStatusInput,
  OrderFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminOrdersFetchers = {
  async getOrderList(filters?: OrderFilters): Promise<PaginatedResponse<AdminOrder>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminOrder>>>(
      AdminRoutes.ORDERS,
      { params: filters }
    );
    return data.data!;
  },

  async getOrderById(orderId: string): Promise<AdminOrderDetail> {
    const { data } = await apiClient.get<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_DETAIL(orderId)
    );
    return data.data!;
  },

  async updateOrderStatus(
    orderId: string,
    input: UpdateOrderStatusInput
  ): Promise<AdminOrderDetail> {
    const { data } = await apiClient.patch<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_STATUS(orderId),
      input
    );
    return data.data!;
  },

  async getOrderInvoice(orderId: string): Promise<Blob> {
    const { data } = await apiClient.get(
      AdminRoutes.ORDER_INVOICE(orderId),
      { responseType: 'blob' }
    );
    return data;
  },
};
