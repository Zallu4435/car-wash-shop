// Dashboard Types
export interface AdminDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalStaff: number;
  revenueGrowth: string;
  ordersGrowth: string;
  customersGrowth: string;
  staffGrowth: string;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
  topServices: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
  }>;
}

// Staff Management Types
export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  area: string;
  status: 'active' | 'inactive' | 'suspended';
  totalJobs: number;
  avgRating: number;
  earnings: number;
  avatar?: string;
  joinedDate: string;
}

export interface AdminStaffDetail extends AdminStaff {
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
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
  role: string;
  area: string;
  password: string;
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}

export interface UpdateStaffInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  area?: string;
  status?: 'active' | 'inactive' | 'suspended';
  skills?: string[];
  availability?: {
    days?: string[];
    hours?: string;
  };
}

export interface StaffFilters {
  status?: 'active' | 'inactive' | 'suspended';
  role?: string;
  area?: string;
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
    brand: string;
    model: string;
    number: string;
    type: string;
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

export interface CustomerFilters {
  status?: 'active' | 'inactive' | 'blocked';
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

// Service Management Types
export interface AdminService {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
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
  price: number;
  duration: number;
  image?: string;
  features?: string[];
  vehicleTypes?: string[];
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  duration?: number;
  status?: 'active' | 'inactive';
  image?: string;
  features?: string[];
  vehicleTypes?: string[];
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
  icon?: string;
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
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive';
}

// Order Management Types
export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: string;
  customerId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  deliveryAddress?: string;
}

export interface AdminOrderDetail extends AdminOrder {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryDetails?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  invoice?: {
    invoiceNumber: string;
    invoiceUrl: string;
  };
}

export interface UpdateOrderStatusInput {
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  note?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
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
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedStaff?: string;
  assignedStaffId?: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
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
  };
  vehicleDetails?: {
    brand: string;
    model: string;
    number: string;
    type: string;
  };
  address: string;
  notes?: string;
  statusHistory: Array<{
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

// Coupon Management Types
export interface AdminCoupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  validFrom: string;
  validUntil: string;
  createdAt: string;
  active?: boolean; // Deprecated: use status instead
}

export interface CreateCouponInput {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  applicableServices?: string[];
  applicableProducts?: string[];
}

export interface UpdateCouponInput {
  description?: string;
  status?: 'active' | 'inactive';
  usageLimit?: number;
  validUntil?: string;
}

// Report Types
export interface RevenueReport {
  totalRevenue: number;
  revenueByService: Array<{
    service: string;
    revenue: number;
    bookings: number;
  }>;
  revenueByProduct: Array<{
    product: string;
    revenue: number;
    sales: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  revenueByPaymentMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
}

export interface StaffPerformanceReport {
  staffId: string;
  staffName: string;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  avgRating: number;
  totalEarnings: number;
  completionRate: number;
  onTimeRate: number;
}

export interface ServiceReport {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  avgRating: number;
  popularityTrend: string;
}

// Notification Types
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'staff' | 'customer' | 'system';
  data?: Record<string, any>;
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

// Vehicle Management Types
export interface VehicleBrand {
  id: string;
  name: string;
  logo?: string;
  status: 'active' | 'inactive';
  modelCount: number;
  createdAt: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'bike';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateVehicleBrandInput {
  name: string;
  logo?: string;
}

export interface CreateVehicleModelInput {
  brandId: string;
  name: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'bike';
}

// Banner & Marketing Types
export interface AdminBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  position: number;
  status: 'active' | 'inactive';
  validFrom: string;
  validUntil: string;
  createdAt: string;
  // Analytics fields
  impressions?: number;
  clicks?: number;
  pages?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean; // Deprecated: use status instead
}

export interface CreateBannerInput {
  title: string;
  description?: string;
  image: string;
  link?: string;
  position: number;
  validFrom: string;
  validUntil: string;
}

export interface UpdateBannerInput {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  position?: number;
  status?: 'active' | 'inactive';
  validFrom?: string;
  validUntil?: string;
}

// Feedback & Support Types
export interface AdminFeedback {
  id: string;
  customerId: string;
  customerName: string;
  bookingId?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'reviewed' | 'resolved';
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
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  date?: string; // Alias for createdAt
}

export interface AdminTicketDetail extends AdminTicket {
  messages: Array<{
    id: string;
    sender: string;
    senderType: 'customer' | 'admin' | 'staff';
    message: string;
    timestamp: string;
    attachments?: string[];
  }>;
}

export interface UpdateTicketStatusInput {
  status: 'in_progress' | 'resolved' | 'closed';
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
  status: 'pending' | 'collected' | 'deposited' | 'verified';
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
