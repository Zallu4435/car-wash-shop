// ============================================
// Status Constants
// ============================================

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIAL: 'partial',
} as const;

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
} as const;

export const COD_PAYMENT_STATUS = {
  PENDING: 'pending',
  COLLECTED: 'collected',
  DEPOSITED: 'deposited',
  VERIFIED: 'verified',
} as const;

// ============================================
// Priority Constants
// ============================================

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// ============================================
// Role Constants
// ============================================

export const USER_ROLE = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

export const STAFF_ROLE = {
  MANAGER: 'manager',
  CLEANER: 'cleaner',
  DRIVER: 'driver',
} as const;

// ============================================
// Sender Type Constants
// ============================================

export const SENDER_TYPE = {
  USER: 'user',
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
  SUPPORT: 'support',
} as const;

// ============================================
// Payment Method Constants
// ============================================

export const PAYMENT_METHOD = {
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
  NETBANKING: 'netbanking',
  COD: 'cod',
  ONLINE: 'online',
} as const;

// ============================================
// Campaign Type Constants
// ============================================

export const CAMPAIGN_TYPE = {
  EMAIL: 'email',
  SMS: 'sms',
  NOTIFICATION: 'notification',
  BANNER: 'banner',
} as const;

// ============================================
// Target Audience Constants
// ============================================

export const TARGET_AUDIENCE = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  NEW: 'new',
} as const;

// ============================================
// Discount Type Constants
// ============================================

export const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

// ============================================
// Type Exports
// ============================================

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
export type FeedbackStatus = (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS];
export type CODPaymentStatus = (typeof COD_PAYMENT_STATUS)[keyof typeof COD_PAYMENT_STATUS];
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type StaffRole = (typeof STAFF_ROLE)[keyof typeof STAFF_ROLE];
export type SenderType = (typeof SENDER_TYPE)[keyof typeof SENDER_TYPE];
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export type CampaignType = (typeof CAMPAIGN_TYPE)[keyof typeof CAMPAIGN_TYPE];
export type TargetAudience = (typeof TARGET_AUDIENCE)[keyof typeof TARGET_AUDIENCE];
export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];
