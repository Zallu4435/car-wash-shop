import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminOrder,
  AdminOrderCustomer,
  AdminOrderDetail,
  UpdateOrderStatusInput,
  OrderFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants/status';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
type RawRecord = Record<string, unknown>;

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const toStringValue = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return undefined;
};

const asRecord = (value: unknown): RawRecord | undefined =>
  value && typeof value === 'object' ? (value as RawRecord) : undefined;

const asRecordArray = (value: unknown): RawRecord[] =>
  Array.isArray(value) ? (value as RawRecord[]) : [];

const normalizeOrder = (orderInput: RawRecord): AdminOrder => {
  if (!orderInput) {
    throw new Error('Invalid order payload');
  }

  const items = asRecordArray(orderInput.items).map((item) => {
    const unitPrice = toNumber(item.unitPrice ?? item.price, 0);
    const quantity = toNumber(item.quantity, 0);
    return {
      id: toStringValue(item.id ?? item._id ?? item.productId ?? item.name),
      productId: item.productId ? String(item.productId) : undefined,
      name: toStringValue(item.productName ?? item.name) ?? 'Product',
      quantity,
      price: unitPrice,
      subtotal: toNumber(item.subtotal, unitPrice * quantity),
      image: toStringValue(item.productImage ?? item.image),
    };
  });

  const customerSource =
    asRecord(orderInput.customer) ||
    asRecord(orderInput.customerDetails) ||
    (typeof orderInput.userId === 'object' ? asRecord(orderInput.userId) : undefined);
  const customer: AdminOrderCustomer | undefined =
    customerSource || orderInput.customer
      ? {
          id:
            toStringValue(customerSource?.id ?? customerSource?._id ?? orderInput.customerId) ??
            undefined,
          name: toStringValue(customerSource?.name ?? orderInput.customer) ?? undefined,
          email: toStringValue(customerSource?.email),
          phone: toStringValue(customerSource?.phone),
        }
      : undefined;

  const deliveryAddress =
    typeof orderInput.deliveryAddress === 'string'
      ? { line1: orderInput.deliveryAddress }
      : (orderInput.deliveryAddress as AdminOrder['deliveryAddress'] | undefined);

  return {
    id: toStringValue(orderInput.id ?? orderInput._id ?? orderInput.orderId) ?? '',
    orderNumber: toStringValue(orderInput.orderNumber ?? orderInput.orderId ?? orderInput.id) ?? '',
    customer,
    items,
    subtotal: toNumber(orderInput.subtotal ?? orderInput.amount ?? orderInput.total, 0),
    discount: toNumber(orderInput.discount, 0),
    tax: toNumber(orderInput.tax, 0),
    shippingFee: toNumber(orderInput.shippingFee ?? orderInput.deliveryFee, 0),
    totalAmount: toNumber(
      orderInput.totalAmount ?? orderInput.total ?? orderInput.finalAmount ?? orderInput.amount,
      0
    ),
    total: toNumber(
      orderInput.total ?? orderInput.totalAmount ?? orderInput.finalAmount ?? orderInput.amount,
      0
    ),
    status: (orderInput.status as string) ?? ORDER_STATUS.PROCESSING,
    paymentStatus: (orderInput.paymentStatus as string) ?? PAYMENT_STATUS.PENDING,
    paymentMethod: (orderInput.paymentMethod as string) ?? 'online',
    createdAt: toStringValue(orderInput.createdAt) ?? new Date().toISOString(),
    updatedAt:
      toStringValue(orderInput.updatedAt) ??
      toStringValue(orderInput.createdAt) ??
      new Date().toISOString(),
    deliveryAddress,
    notes: (orderInput.notes as AdminOrder['notes']) ?? undefined,
  };
};

const normalizeOrderDetail = (orderInput: RawRecord): AdminOrderDetail => {
  const base = normalizeOrder(orderInput);
  const addressString = base.deliveryAddress
    ? [base.deliveryAddress.line1, base.deliveryAddress.line2, base.deliveryAddress.city, base.deliveryAddress.state, base.deliveryAddress.pincode]
        .filter(Boolean)
        .join(', ')
    : undefined;

  return {
    ...base,
    customerDetails: (orderInput.customerDetails as AdminOrderCustomer | undefined) ?? base.customer,
    deliveryDetails:
      (orderInput.deliveryDetails as AdminOrderDetail['deliveryDetails']) ??
      (base.deliveryAddress
        ? {
            ...base.deliveryAddress,
            address: addressString,
          }
        : undefined),
    statusHistory: orderInput.statusHistory as AdminOrderDetail['statusHistory'],
    invoice: orderInput.invoice as AdminOrderDetail['invoice'],
  };
};

const mockOrders = [
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

const mockOrderDetails = {
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
        data: paginatedOrders.map(normalizeOrder),
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
    const payload = data.data!;
    return {
      ...payload,
      data: payload.data.map(normalizeOrder),
    };
  },

  async getOrderById(orderId: string): Promise<AdminOrderDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const orderDetail = mockOrderDetails[orderId];
      if (!orderDetail) {
        throw new Error('Order not found');
      }
      return normalizeOrderDetail(orderDetail);
    }

    const { data } = await apiClient.get<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_DETAIL(orderId)
    );
    return normalizeOrderDetail(data.data!);
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
      return normalizeOrderDetail({
        ...orderDetail,
        status: input.status,
        statusHistory: [
          ...(orderDetail.statusHistory || []),
          {
            status: input.status,
            timestamp: new Date().toISOString(),
            note: input.note,
          },
        ],
      });
    }

    const { data } = await apiClient.patch<ApiResponse<AdminOrderDetail>>(
      AdminRoutes.ORDER_STATUS(orderId),
      input
    );
    return normalizeOrderDetail(data.data!);
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
