import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Order,
  OrderFeedbackInput,
  OrderFilters,
  CouponValidation,
} from '@/types/order';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockOrders } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const orderFetchers = {
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOrders = [...mockOrders];
      
      if (filters?.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
      }
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
      
      return {
        data: paginatedOrders as any,
        total: filteredOrders.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOrders.length / limit),
      };
    }
    
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      CustomerRoutes.ORDERS,
      { params: filters }
    );
    return data.data!;
  },

  async getOrderById(orderId: string): Promise<Order> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');
      return order as any;
    }
    
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
