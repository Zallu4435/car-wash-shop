import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateProductOrderInput,
  Order,
  OrderFilters,
} from '@/types/order';
import { CustomerRoutes } from '@/lib/constants/routes';
// Mocks removed; always hit API for orders endpoints

const normalizeOrder = (order: (Order & { _id?: string }) | undefined): Order => {
  if (!order) {
    return order as Order;
  }

  const { _id, id, ...rest } = order as Order & { _id?: string };
  const normalizedId = id ?? (_id ? String(_id) : '');

  return {
    ...rest,
    id: normalizedId,
  };
};

export const orderFetchers = {
  async createProductOrder(input: CreateProductOrderInput): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>(
      CustomerRoutes.ORDERS,
      input
    );
    return normalizeOrder(data.data!);
  },

  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      CustomerRoutes.ORDERS,
      { params: filters }
    );
    const payload = data.data!;
    return {
      ...payload,
      data: payload.data.map((order) => normalizeOrder(order)),
    };
  },

  async getOrderById(orderId: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(
      `${CustomerRoutes.ORDERS}/${orderId}`
    );
    return normalizeOrder(data.data!);
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
};
