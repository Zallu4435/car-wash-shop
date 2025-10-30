// Admin API - Centralized exports for all admin domains
// This file provides a single import point for all admin API functionality

// Dashboard
export * from './admin-dashboard/fetchers';
export * from './admin-dashboard/queries';

// Staff Management
export * from './admin-staff/fetchers';
export * from './admin-staff/queries';

// Customer Management
export * from './admin-customers/fetchers';
export * from './admin-customers/queries';

// Catalog Management (Services, Products, Categories)
export * from './admin-catalog/fetchers';
export * from './admin-catalog/queries';

// Order Management
export * from './admin-orders/fetchers';
export * from './admin-orders/queries';

// Booking/Request Management
export * from './admin-requests/fetchers';
export * from './admin-requests/queries';

// Coupon Management
export * from './admin-coupons/fetchers';
export * from './admin-coupons/queries';

// Reports
export * from './admin-reports/fetchers';
export * from './admin-reports/queries';

// Settings & Profile
export * from './admin-settings/fetchers';
export * from './admin-settings/queries';

// Vehicle Management
export * from './admin-vehicles/fetchers';
export * from './admin-vehicles/queries';

// Marketing (Banners, Posters)
export * from './admin-marketing/fetchers';
export * from './admin-marketing/queries';

// Support (Feedback, Tickets)
export * from './admin-support/fetchers';
export * from './admin-support/queries';

// Payment Management
export * from './admin-payments/fetchers';
export * from './admin-payments/queries';
