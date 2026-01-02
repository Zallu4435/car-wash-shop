import { OrderStatus, PaymentStatus } from '@/lib/constants/status';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderAddress {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  phone?: string;
}

// Invoice details snapshot - captures company info at order time for invoice immutability
export interface InvoiceDetails {
  companyName?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  gst?: string;
  website?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress?: OrderAddress | string;
  trackingNumber?: string;
  invoiceDetails?: InvoiceDetails | null;
  meta?: Record<string, string | number | boolean | null | undefined>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}


export interface CreateProductOrderInput {
  items: CreateOrderItemInput[];
  addressId: string;
  paymentMethod: 'cod' | 'online';
  discount?: number;
  tax?: number;
  shippingFee?: number;
  notes?: string;
  source?: 'cart' | 'direct';
}
