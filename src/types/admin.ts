import { BookingStatus, OrderStatus, PaymentStatus, TicketStatus, FeedbackStatus, CODPaymentStatus, Priority, SenderType } from '@/lib/constants/status';

// Staff Management Types
export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'suspended';
  totalJobs: number;
  avgRating: number;
  earnings: number;
  avatar?: string;
  joinedDate: string;
}

export interface AdminStaffDetail extends AdminStaff {
  skills?: string[];
  recentJobs: Array<{
    id: string;
    service: string;
    customer: string;
    date: string;
    status: string;
    amount: number;
  }>;
  performanceMetrics: {
    completionRate: number;
    onTimeRate: number;
    customerSatisfaction: number;
  };
}

export interface CreateStaffInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  skills?: string[];
}

export interface UpdateStaffInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'suspended';
  password?: string;
  skills?: string[];
}

export interface StaffFilters {
  status?: 'active' | 'suspended';
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Customer Management Types
export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
  avatar?: string;
}

export interface AdminCustomerDetail extends AdminCustomer {
  addresses: Array<{
    id: string;
    type: string;
    address: string;
    isPrimary: boolean;
  }>;
  vehicles: Array<{
    id: string;
    category: 'car' | 'bike';
    bodyType: string;
  }>;
  recentOrders: Array<{
    id: string;
    service: string;
    amount: number;
    status: string;
    date: string;
  }>;
  orderStats: {
    completed: number;
    cancelled: number;
    pending: number;
  };
}

// Service Management Types
export interface AdminService {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  pricing: Array<{ vehicleType: string; price: number }>;
  duration: number;
  status: 'active' | 'inactive';
  image?: string;
  totalBookings: number;
  rating: number;
  createdAt: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  categoryId: string;
  pricing: Array<{ vehicleType: string; price: number }>;
  duration: number;
  image?: string;
  features?: string[];
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  categoryId?: string;
  pricing?: Array<{ vehicleType: string; price: number }>;
  duration?: number;
  status?: 'active' | 'inactive';
  image?: string;
  features?: string[];
}

// Product Management Types
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
  rating: number;
  createdAt: string;
  active?: boolean; // Deprecated: use status instead
}

export interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stock?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  images?: string[];
  specifications?: Record<string, string>;
}

// Category Management Types
export interface AdminCategory {
  id: string;
  name: string;
  type: 'service' | 'product';
  description?: string;
  status: 'active' | 'inactive';
  itemCount: number;
  createdAt: string;
  count?: number; // Alias for itemCount
  active?: boolean; // Deprecated: use status instead
}

export interface CreateCategoryInput {
  name: string;
  type: 'service' | 'product';
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

// Order Management Types
export interface AdminOrderCustomer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface AdminOrderItem {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  subtotal?: number;
  image?: string;
}

export interface AdminOrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
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

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer?: AdminOrderCustomer;
  items?: AdminOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  total?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: AdminOrderAddress;
  invoiceDetails?: InvoiceDetails | null;
  notes?: Array<{
    note: string;
    addedBy?: string;
    addedAt?: string;
  }>;
}

export interface AdminOrderDetail extends AdminOrder {
  customerDetails?: AdminOrderCustomer;
  deliveryDetails?: AdminOrderAddress & {
    address?: string;
  };
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  invoice?: {
    invoiceNumber?: string;
    invoiceUrl?: string;
  };
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  note?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
  dateRange?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Booking/Request Management Types
export interface AdminBooking {
  id: string;
  bookingNumber: string;
  customer: string;
  customerId: string;
  service: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  assignedStaff?: string;
  assignedStaffId?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  // Alias fields for compatibility
  date?: string; // Alias for scheduledDate
  time?: string; // Alias for scheduledTime
  name?: string; // Alias for customer
}

export interface AdminBookingDetail extends AdminBooking {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  vehicleDetails?: {
    category: 'car' | 'bike';
    bodyType: string;
  };
  address?: string | {
    label?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    phone?: string;
    fullAddress?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  paymentType?: 'full' | 'advance';
  totalAmount?: number;
  advanceAmount?: number;
  assignedStaff?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    status?: string;
    skills?: string[];
  } | string | null;
  addOns?: string[];
  feedback?: {
    rating?: number;
    comment?: string;
    createdAt?: string;
  };
  scheduledDateFormatted?: string;
  scheduledDateTime?: string;
  notes?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

export interface AssignStaffInput {
  staffId: string;
  notes?: string;
}

export interface BookingFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  staffId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Notification Types
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'staff' | 'customer' | 'system';
  data?: Record<string, string | number | boolean | null | undefined>;
  read: boolean;
  createdAt: string;
}

// Settings Types
export interface DeliverySettings {
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryRadius: number;
  estimatedDeliveryTime: string;
}

export interface PaymentSettings {
  enableCOD: boolean;
  enableOnline: boolean;
  enableWallet: boolean;
  codCharges: number;
  paymentGateway: string;
  gatewayCredentials?: Record<string, string>;
  // Aliases for backward compatibility
  codEnabled?: boolean;
  advancePaymentsEnabled?: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  permissions: string[];
}

export interface UpdateAdminProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Feedback & Support Types
export interface AdminFeedback {
  id: string;
  customerId: string;
  customerName: string;
  bookingId?: string;
  rating: number;
  comment: string;
  status: FeedbackStatus;
  feedbackType?: 'service' | 'product';
  type?: string; // For categorization like 'Compliment', 'Suggestion', 'Bug'
  createdAt: string;
}

export interface AdminTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customer?: string; // Alias for customerName
  email?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  date?: string; // Alias for createdAt
}

export interface AdminTicketDetail extends AdminTicket {
  messages: Array<{
    id: string;
    sender: string;
    senderType: SenderType;
    message: string;
    timestamp: string;
    attachments?: string[];
  }>;
}

export interface UpdateTicketStatusInput {
  status: Exclude<TicketStatus, 'open'>;
  assignedTo?: string;
  note?: string;
}

export interface AddTicketMessageInput {
  message: string;
  attachments?: string[];
}

// COD Management Types
export interface CODTransaction {
  id: string;
  orderId: string;
  bookingId?: string;
  staffId: string;
  staffName: string;
  amount: number;
  status: CODPaymentStatus;
  collectedAt?: string;
  depositedAt?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface CODReport {
  totalCollected: number;
  totalDeposited: number;
  totalPending: number;
  transactions: CODTransaction[];
  staffWise: Array<{
    staffId: string;
    staffName: string;
    collected: number;
    deposited: number;
    pending: number;
  }>;
}
