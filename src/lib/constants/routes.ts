export const ROUTES = {
  // Customer Routes (no prefix - root level)
  CUSTOMER: {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    
    // Services
    SERVICES: '/services',
    SERVICE_DETAIL: (id: string) => `/services/${id}`,
    SERVICE_SEARCH: '/services/search',
    
    // Booking
    BOOK: '/book',
    BOOK_SCHEDULE: '/book/schedule',
    BOOK_SUMMARY: '/book/summary',
    BOOK_PAYMENT: '/book/payment-option',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id: string) => `/products/${id}`,
    PRODUCT_SEARCH: '/products/search',
    
    // Cart & Checkout
    CART: '/cart',
    CHECKOUT: '/checkout',
    
    // Orders
    ORDERS: '/orders',
    ORDERS_ALL: '/orders/all',
    ORDERS_SERVICES: '/orders/services',
    ORDERS_PRODUCTS: '/orders/products',
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
    ORDER_INVOICE: (id: string) => `/orders/${id}/invoice`,
    
    // Payment
    PAYMENT: '/payment',
    PAYMENT_STATUS: '/payment/status',
    PAYMENT_RECEIPT: '/payment/receipt',
    
    // Profile
    PROFILE: '/profile',
    VEHICLES: '/profile/vehicles',
    ADD_VEHICLE: '/profile/vehicles/add',
    ADDRESSES: '/profile/addresses',
    ADDRESSES_PRIMARY: (id: string) => `/profile/addresses/${id}/primary`,
    ADD_ADDRESS: '/profile/addresses/add',
    PROFILE_SECURITY: '/profile/security',
    PROFILE_DELETE: '/profile/delete',
    
    // Support
    FEEDBACK: '/feedback',
    SUPPORT: '/support',
    COMPLAINTS: '/support/complaints',
    COMPLAINT_DETAIL: (id: string) => `/support/complaints/${id}`,
    SUPPORT_TICKETS: '/support/tickets',
    SUPPORT_TOPICS: '/support/topics',
    
    // Notifications (Page)
    NOTIFICATIONS_PAGE: '/notifications',
    
    // API Routes
    NOTIFICATIONS: '/notifications',
    SEARCH: '/search',
    BOOKINGS: '/bookings',
    BOOKINGS_PREVIEW: '/bookings/preview',
    BOOKINGS_SLOTS: '/bookings/slots',
    SERVICES_CATEGORIES: '/services/categories',
    PRODUCTS_CATEGORIES: '/products/categories',
    COUPONS_APPLY: '/coupons/apply',
    CHECKOUT_SESSION: '/checkout/session',
    CHECKOUT_SUCCESS: '/checkout/success',
    CHECKOUT_FAILURE: '/checkout/failure',
    AUTH_SEND_OTP: '/auth/send-otp',
    AUTH_VERIFY_OTP: '/auth/verify-otp',
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',
    AUTH_ME: '/auth/me',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',
    NOTIFICATIONS_READ: 'read',
    NOTIFICATIONS_READ_ALL: 'read-all',
  },

  // Staff Routes (with /staff prefix)
  STAFF: {
    LOGIN: '/staff/auth/login',
    DASHBOARD: '/staff/dashboard',
    
    // Jobs
    JOBS: '/staff/jobs',
    JOB_DETAIL: (id: string) => `/staff/jobs/${id}`,
    JOB_COMPLETE: (id: string) => `/staff/jobs/${id}/complete`,
    JOB_NAVIGATE: (id: string) => `/staff/jobs/${id}/navigate`,
    
    // Payments
    PAYMENTS: '/staff/payments',
    PAYMENT_DETAIL: (id: string) => `/staff/payments/${id}`,
    
    // Other
    HISTORY: '/staff/history',
    PROFILE: '/staff/profile',
    LOGOUT: '/staff/logout',
    NOTIFICATIONS: '/staff/notifications',
    MARK_NOTIFICATION_AS_READ: '/staff/notifications/mark-read',
  },

  // Admin Routes (with /admin prefix)
  ADMIN: {
    LOGIN: '/admin/auth/login',
    DASHBOARD: '/admin/dashboard',
    
    // Catalog Management
    SERVICES: '/admin/services',
    SERVICE_NEW: '/admin/services/new',
    SERVICE_EDIT: (id: string) => `/admin/services/${id}/edit`,
    
    PRODUCTS: '/admin/products',
    PRODUCT_NEW: '/admin/products/new',
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
    
    CATEGORIES: '/admin/categories',
    CATEGORY_NEW: '/admin/categories/new',
    CATEGORY_EDIT: (id: string) => `/admin/categories/${id}/edit`,
    
    // Staff Management
    STAFF: '/admin/staff',
    STAFF_NEW: '/admin/staff/new',
    STAFF_DETAIL: (id: string) => `/admin/staff/${id}`,
    STAFF_EDIT: (id: string) => `/admin/staff/${id}/edit`,
    
    // Customer Management
    CUSTOMERS: '/admin/customers',
    CUSTOMER_DETAIL: (id: string) => `/admin/customers/${id}`,
    
    // Vehicle Management (Pages)
    VEHICLES: '/admin/vehicles',
    VEHICLE_TYPES: '/admin/vehicles/types',
    VEHICLE_BODY_TYPES: '/admin/vehicles/body-types',
    VEHICLE_MODELS_PAGE: '/admin/vehicles/models',
    
    // Vehicle Management (API Endpoints)
    VEHICLE_BRANDS: '/api/admin/vehicles/brands',
    VEHICLE_MODELS: '/api/admin/vehicles/models',
    
    // Order Management
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
    ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
    ORDER_INVOICE: (id: string) => `/admin/orders/${id}/invoice`,
    
    // Booking/Request Management
    REQUESTS: '/admin/requests',
    REQUEST_DETAIL: (id: string) => `/admin/requests/${id}`,
    REQUEST_ASSIGN: (id: string) => `/admin/requests/${id}/assign`,
    
    // Marketing
    BANNERS: '/admin/banners',
    BANNER_NEW: '/admin/banners/new',
    BANNER_EDIT: (id: string) => `/admin/banners/${id}/edit`,
    
    POSTERS: '/admin/posters',
    POSTER_NEW: '/admin/posters/new',
    POSTER_EDIT: (id: string) => `/admin/posters/${id}/edit`,
    
    CAMPAIGNS: '/admin/campaigns',
    CAMPAIGN_NEW: '/admin/campaigns/new',
    
    // Coupons
    COUPONS: '/admin/coupons',
    COUPON_NEW: '/admin/coupons/new',
    COUPON_DETAIL: (id: string) => `/admin/coupons/${id}`,
    COUPON_EDIT: (id: string) => `/admin/coupons/${id}/edit`,
    
    // Payment Management
    PAYMENTS: '/admin/payments',
    COD_REPORTS: '/admin/payments/cod/reports',
    
    // Cancellations
    CANCELLATIONS: '/admin/cancellations',
    
    // Reports
    REPORTS: '/admin/reports',
    REPORTS_SERVICES: '/admin/reports/services',
    REPORTS_ORDERS: '/admin/reports/orders',
    REPORTS_STAFF: '/admin/reports/staff',
    REPORTS_PAYMENTS: '/admin/reports/payments',
    REPORTS_COUPONS: '/admin/reports/coupons',
    
    // Feedback & Support
    FEEDBACK: '/admin/feedback',
    TICKETS: '/admin/tickets',
    TICKET_DETAIL: (id: string) => `/admin/tickets/${id}`,
    
    // Settings
    SETTINGS: '/admin/settings',
    SETTINGS_DELIVERY: '/admin/settings/delivery-fees',
    SETTINGS_PAYMENT: '/admin/settings/payment-settings',
    PROFILE: '/admin/profile',
    NOTIFICATIONS: '/admin/notifications',
    SLOTS: '/admin/slots',
  },

  // Special Routes
  ADMIN_ACCESS: '/portal-admin-access',
} as const;

// Export individual route groups for convenience
export const CustomerRoutes = ROUTES.CUSTOMER;
export const StaffRoutes = ROUTES.STAFF;
export const AdminRoutes = ROUTES.ADMIN;
// NOTE: Keep all route constants within ROUTES to preserve typing
