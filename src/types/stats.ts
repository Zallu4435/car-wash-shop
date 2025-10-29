export interface TrustStat {
  id: string;
  label: string;
  value: string;
  icon: string;
  description?: string;
}

export interface BusinessStats {
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  activeStaff: number;
  completedOrders: number;
}
