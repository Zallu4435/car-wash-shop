import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Order,
  OrderFeedbackInput,
  OrderFilters,
  CouponValidation,
} from '@/types/order';
import { CustomerRoutes } from '@/lib/constants/routes';
// Mocks removed; always hit API for orders endpoints

export const orderFetchers = {
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      CustomerRoutes.ORDERS,
      { params: filters }
    );
    return data.data!;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(
      `${CustomerRoutes.ORDERS}/${orderId}`
    );
    return data.data!;
  },

  async downloadInvoice(orderId: string): Promise<Blob> {
    const { data } = await apiClient.get(`${CustomerRoutes.ORDERS}/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return data;
  },

  async cancelOrder(orderId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.ORDERS}/${orderId}/cancel`
    );
    return data.data!;
  },

  async submitFeedback(input: OrderFeedbackInput): Promise<{ message: string }> {
    const { orderId, ...feedbackData } = input;
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.ORDERS}/${orderId}/feedback`,
      feedbackData
    );
    return data.data!;
  },

  async validateCoupon(
    code: string,
    amount: number
  ): Promise<CouponValidation> {
    const { data } = await apiClient.post<ApiResponse<CouponValidation>>(
      CustomerRoutes.COUPONS_APPLY,
      { code, amount }
    );
    return data.data!;
  },
};
