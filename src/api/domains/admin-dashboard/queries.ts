import { useQuery } from '@tanstack/react-query';
import { adminDashboardFetchers } from './fetchers';

// Query keys
export const adminDashboardKeys = {
    all: ['admin-dashboard'] as const,
    stats: (dateRange?: string) => [...adminDashboardKeys.all, 'stats', dateRange] as const,
    recentOrders: () => [...adminDashboardKeys.all, 'recent-orders'] as const,
    recentBookings: () => [...adminDashboardKeys.all, 'recent-bookings'] as const,
    orderStatus: () => [...adminDashboardKeys.all, 'order-status'] as const,
    bookingStatus: () => [...adminDashboardKeys.all, 'booking-status'] as const,
    activity: (period?: string) => [...adminDashboardKeys.all, 'activity', period] as const,
    summary: (dateRange?: string) => [...adminDashboardKeys.all, 'summary', dateRange] as const,
};

/**
 * Hook to fetch dashboard statistics
 */
export const useAdminDashboardStats = (dateRange?: string) => {
    return useQuery({
        queryKey: adminDashboardKeys.stats(dateRange),
        queryFn: () => adminDashboardFetchers.getStats(dateRange),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Hook to fetch recent orders
 */
export const useAdminRecentOrders = (limit?: number) => {
    return useQuery({
        queryKey: adminDashboardKeys.recentOrders(),
        queryFn: () => adminDashboardFetchers.getRecentOrders(limit),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Hook to fetch recent bookings
 */
export const useAdminRecentBookings = (limit?: number) => {
    return useQuery({
        queryKey: adminDashboardKeys.recentBookings(),
        queryFn: () => adminDashboardFetchers.getRecentBookings(limit),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Hook to fetch order status distribution
 */
export const useAdminOrderStatus = () => {
    return useQuery({
        queryKey: adminDashboardKeys.orderStatus(),
        queryFn: () => adminDashboardFetchers.getOrderStatusDistribution(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to fetch booking status distribution
 */
export const useAdminBookingStatus = () => {
    return useQuery({
        queryKey: adminDashboardKeys.bookingStatus(),
        queryFn: () => adminDashboardFetchers.getBookingStatusDistribution(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to fetch activity data
 */
export const useAdminActivityData = (period?: string) => {
    return useQuery({
        queryKey: adminDashboardKeys.activity(period),
        queryFn: () => adminDashboardFetchers.getActivityData(period),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Hook to fetch combined dashboard summary
 * This is the recommended hook to use for the dashboard page
 */
export const useAdminDashboardSummary = (dateRange?: string) => {
    return useQuery({
        queryKey: adminDashboardKeys.summary(dateRange),
        queryFn: () => adminDashboardFetchers.getDashboardSummary(dateRange),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};
