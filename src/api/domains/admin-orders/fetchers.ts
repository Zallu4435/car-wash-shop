import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { AdminOrder, AdminOrderDetail, UpdateOrderStatusInput, OrderFilters } from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants/status';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockOrders: AdminOrder[] = [
  {
    id: 'ORD001',
    orderNumber: 'ORD-2024-001',
    customer: 'Rajesh Kumar',
    customerId: 'CUST001',
    items: [
      { id: 'PROD001', name: 'Car Shampoo', quantity: 2, price: 299 },
      { id: 'PROD002', name: 'Microfiber Cloth', quantity: 3, price: 199 },
    ],
    total: 1195,
    status: ORDER_STATUS.DELIVERED,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'Online',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: 'Koramangala, Bangalore',
  },
  {
    id: 'ORD002',
    orderNumber: 'ORD-2024-002',
    customer: 'Priya Sharma',
    customerId: 'CUST002',
    items: [
      { id: 'PROD003', name: 'Tire Cleaner', quantity: 1, price: 399 },
      { id: 'PROD004', name: 'Dashboard Polish', quantity: 1, price: 249 },
    ],
    total: 648,
    status: ORDER_STATUS.PROCESSING,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'UPI',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: 'Indiranagar, Bangalore',
  },
  {
    id: 'ORD003',
    orderNumber: 'ORD-2024-003',
    customer: 'Amit Patel',
    customerId: 'CUST003',
    items: [
      { id: 'PROD005', name: 'Wax Polish', quantity: 1, price: 599 },
    ],
    total: 599,
    status: ORDER_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMethod: 'COD',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: 'HSR Layout, Bangalore',
  },
  {
    id: 'ORD004',
    orderNumber: 'ORD-2024-004',
    customer: 'Sneha Reddy',
    customerId: 'CUST004',
    items: [
      { id: 'PROD001', name: 'Car Shampoo', quantity: 1, price: 299 },
      { id: 'PROD002', name: 'Microfiber Cloth', quantity: 5, price: 199 },
    ],
    total: 1294,
    status: ORDER_STATUS.SHIPPED,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'Card',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: 'Whitefield, Bangalore',
  },
];

const mockOrderDetails: Record<string, AdminOrderDetail> = {
  ORD001: {
    ...mockOrders[0],
    customerDetails: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 98765 43210',
    },
    deliveryDetails: {
      address: '123, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    statusHistory: [
      {
        status: ORDER_STATUS.PENDING,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Order placed',
      },
      {
        status: ORDER_STATUS.PROCESSING,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Order confirmed',
      },
      {
        status: ORDER_STATUS.SHIPPED,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Order shipped',
      },
      {
        status: ORDER_STATUS.DELIVERED,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Order delivered successfully',
      },
    ],
    invoice: {
      invoiceNumber: 'INV-2024-001',
      invoiceUrl: '/invoices/INV-2024-001.pdf',
    },
  },
};

export const adminOrdersFetchers = {
  async getOrderList(filters?: OrderFilters): Promise<PaginatedResponse<AdminOrder>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredOrders = [...mockOrders];

      // Apply filters
      if (filters?.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
      }
      if (filters?.paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === filters.paymentStatus);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(o =>
          o.orderNumber.toLowerCase().includes(searchLower) ||
          o.customer.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.fromDate) {
        filteredOrders = filteredOrders.filter(o => o.createdAt >= filters.fromDate!);
      }
      if (filters?.toDate) {
        filteredOrders = filteredOrders.filter(o => o.createdAt <= filters.toDate!);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

      return {
        data: paginatedOrders,
        total: filteredOrders.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOrders.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminOrder>>>(
      AdminRoutes.ORDERS,
      { params: filters }
    );
    return data.data!;
  },

  async getOrderById(orderId: string): Promise<AdminOrderDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const orderDetail = mockOrderDetails[orderId];
      if (!orderDetail) {
        throw new Error('Order not found');
      }
      return orderDetail;
    }

    const { data } = await apiClient.get<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_DETAIL(orderId)
    );
    return data.data!;
  },

  async updateOrderStatus(
    orderId: string,
    input: UpdateOrderStatusInput
  ): Promise<AdminOrderDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orderDetail = mockOrderDetails[orderId];
      if (!orderDetail) {
        throw new Error('Order not found');
      }
      return {
        ...orderDetail,
        status: input.status,
        statusHistory: [
          ...orderDetail.statusHistory,
          {
            status: input.status,
            timestamp: new Date().toISOString(),
            note: input.note,
          },
        ],
      };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_STATUS(orderId),
      input
    );
    return data.data!;
  },

  async getOrderInvoice(orderId: string): Promise<Blob> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return a mock PDF blob
      const pdfContent = `Mock Invoice for Order ${orderId}`;
      return new Blob([pdfContent], { type: 'application/pdf' });
    }

    const { data } = await apiClient.get(
      AdminRoutes.ORDER_INVOICE(orderId),
      { responseType: 'blob' }
    );
    return data;
  },
};
