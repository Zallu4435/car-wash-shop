// Import mock data
import servicesData from '@/mocks/data/services.json';
import productsData from '@/mocks/data/products.json';
import bookingsData from '@/mocks/data/bookings.json';
import ordersData from '@/mocks/data/orders.json';
import usersData from '@/mocks/data/users.json';
import staffData from '@/mocks/data/staff.json';
import vehiclesData from '@/mocks/data/vehicles.json';
import couponsData from '@/mocks/data/coupons.json';
import bannersData from '@/mocks/data/banners.json';
import postersData from '@/mocks/data/posters.json';
import paymentsData from '@/mocks/data/payments.json';
import settingsData from '@/mocks/data/settings.json';

// Export data getters
export const getMockData = {
  services: () => servicesData,
  products: () => productsData,
  bookings: () => bookingsData,
  orders: () => ordersData,
  users: () => usersData,
  staff: () => staffData,
  vehicles: () => vehiclesData,
  coupons: () => couponsData,
  banners: () => bannersData,
  posters: () => postersData,
  payments: () => paymentsData,
  settings: () => settingsData,
};

// Helper functions
export const getServiceById = (id: string) => {
  return servicesData.find(s => s.id === id);
};

export const getProductById = (id: string) => {
  return productsData.find(p => p.id === id);
};

export const getBookingById = (id: string) => {
  return bookingsData.find(b => b.id === id);
};

export const getOrderById = (id: string) => {
  return ordersData.find(o => o.id === id);
};

export const getStaffById = (id: string) => {
  return staffData.find(s => s.id === id);
};

export const getCouponByCode = (code: string) => {
  return couponsData.find(c => c.code === code);
};
