// Import from customer-mock-data.ts for properly typed data
import {
  mockOrders,
  mockServices,
  mockProducts,
  mockBookings,
  mockVehicles,
  mockAddresses,
  mockCustomerProfile,
  mockTestimonials,
  mockTrustStats,
  mockPosters,
  mockBanners,
} from '@/mocks/data/customer-mock-data';

// Import JSON files for data not yet in customer-mock-data.ts (admin/staff data)
import couponsData from '@/mocks/data/coupons.json';
import paymentsData from '@/mocks/data/payments.json';
import settingsData from '@/mocks/data/settings.json';
import staffData from '@/mocks/data/staff.json';
import usersData from '@/mocks/data/users.json';

// Export data getters - centralized mock data access
export const getMockData = {
  services: () => mockServices,
  products: () => mockProducts,
  bookings: () => mockBookings,
  orders: () => mockOrders,
  vehicles: () => mockVehicles,
  addresses: () => mockAddresses,
  profile: () => mockCustomerProfile,
  testimonials: () => mockTestimonials,
  trustStats: () => mockTrustStats,
  posters: () => mockPosters,
  banners: () => mockBanners,
  // JSON-based data (admin/staff data - to be migrated later)
  users: () => usersData,
  staff: () => staffData,
  coupons: () => couponsData,
  payments: () => paymentsData,
  settings: () => settingsData,
};

// Helper functions
export const getServiceById = (id: string) => {
  return mockServices.find(s => s.id === id);
};

export const getProductById = (id: string) => {
  return mockProducts.find(p => p.id === id);
};

export const getBookingById = (id: string) => {
  return mockBookings.find(b => b.id === id);
};

export const getOrderById = (id: string) => {
  return mockOrders.find(o => o.id === id);
};

export const getVehicleById = (id: string) => {
  return mockVehicles.find(v => v.id === id);
};

export const getAddressById = (id: string) => {
  return mockAddresses.find(a => a.id === id);
};

export const getStaffById = (id: string) => {
  return staffData.find(s => s.id === id);
};

export const getCouponByCode = (code: string) => {
  return couponsData.find(c => c.code === code);
};
