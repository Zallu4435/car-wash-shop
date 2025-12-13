import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

// Dashboard API routes
const DASHBOARD_BASE = '/admin/dashboard';

// Types for dashboard data
export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    totalOrders: number;
    ordersChange: number;
    totalBookings: number;
    bookingsChange: number;
    totalCustomers: number;
    customersChange: number;
}

export interface RecentOrder {
    id: string;
    customer: string;
    date: string;
    amount: number;
    status: string;
    paymentStatus: string;
}

export interface RecentBooking {
    id: string;
    customer: string;
    service: string;
    date: string;
    amount: number;
    status: string;
}

export interface StatusDistribution {
    name: string;
    value: number;
    color: string;
}

export interface ActivityData {
    name: string;
    product: number;
    service: number;
}

export interface DashboardSummary {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    recentBookings: RecentBooking[];
    orderStatusData: StatusDistribution[];
    bookingStatusData: StatusDistribution[];
    activityData: ActivityData[];
}

export const adminDashboardFetchers = {
    /**
     * Get dashboard statistics
     */
    async getStats(dateRange?: string): Promise<DashboardStats> {
        const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
            `${DASHBOARD_BASE}/stats`,
            { params: { dateRange } }
        );
        return data.data!;
    },

    /**
     * Get recent orders (limited to 10)
     */
    async getRecentOrders(limit?: number): Promise<RecentOrder[]> {
        const { data } = await apiClient.get<ApiResponse<RecentOrder[]>>(
            `${DASHBOARD_BASE}/recent-orders`,
            { params: { limit: limit || 10 } }
        );
        return data.data!;
    },

    /**
     * Get recent bookings (limited to 10)
     */
    async getRecentBookings(limit?: number): Promise<RecentBooking[]> {
        const { data } = await apiClient.get<ApiResponse<RecentBooking[]>>(
            `${DASHBOARD_BASE}/recent-bookings`,
            { params: { limit: limit || 10 } }
        );
        return data.data!;
    },

    /**
     * Get order status distribution for pie chart
     */
    async getOrderStatusDistribution(): Promise<StatusDistribution[]> {
        const { data } = await apiClient.get<ApiResponse<StatusDistribution[]>>(
            `${DASHBOARD_BASE}/order-status`
        );
        return data.data!;
    },

    /**
     * Get booking status distribution for pie chart
     */
    async getBookingStatusDistribution(): Promise<StatusDistribution[]> {
        const { data } = await apiClient.get<ApiResponse<StatusDistribution[]>>(
            `${DASHBOARD_BASE}/booking-status`
        );
        return data.data!;
    },

    /**
     * Get activity data for charts
     */
    async getActivityData(period?: string): Promise<ActivityData[]> {
        const { data } = await apiClient.get<ApiResponse<ActivityData[]>>(
            `${DASHBOARD_BASE}/activity`,
            { params: { period: period || 'week' } }
        );
        return data.data!;
    },

    /**
     * Get combined dashboard summary (all data in one request)
     * This is the recommended method to avoid multiple API calls
     */
    async getDashboardSummary(dateRange?: string): Promise<DashboardSummary> {
        const { data } = await apiClient.get<ApiResponse<DashboardSummary>>(
            `${DASHBOARD_BASE}/summary`,
            { params: { dateRange } }
        );
        return data.data!;
    },
};
