import { useQuery } from '@tanstack/react-query';
import {
    adminReportsFetchers,
    type ReportFilters,
    type OrdersReportResponse,
    type BookingsReportResponse,
    type OrdersSummary,
    type BookingsSummary,
} from './fetchers';

// Query keys
export const adminReportsKeys = {
    all: ['admin-reports'] as const,
    orders: (filters: ReportFilters) => [...adminReportsKeys.all, 'orders', filters] as const,
    bookings: (filters: ReportFilters) => [...adminReportsKeys.all, 'bookings', filters] as const,
    ordersSummary: (filters: ReportFilters) => [...adminReportsKeys.all, 'orders-summary', filters] as const,
    bookingsSummary: (filters: ReportFilters) => [...adminReportsKeys.all, 'bookings-summary', filters] as const,
};

/**
 * Hook to fetch orders report with filters
 */
export function useOrdersReport(filters: ReportFilters = {}) {
    return useQuery<OrdersReportResponse, Error>({
        queryKey: adminReportsKeys.orders(filters),
        queryFn: () => adminReportsFetchers.getOrdersReport(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

/**
 * Hook to fetch bookings report with filters
 */
export function useBookingsReport(filters: ReportFilters = {}) {
    return useQuery<BookingsReportResponse, Error>({
        queryKey: adminReportsKeys.bookings(filters),
        queryFn: () => adminReportsFetchers.getBookingsReport(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

/**
 * Hook to fetch orders summary
 */
export function useOrdersSummary(filters: ReportFilters = {}) {
    return useQuery<OrdersSummary, Error>({
        queryKey: adminReportsKeys.ordersSummary(filters),
        queryFn: () => adminReportsFetchers.getOrdersSummary(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

/**
 * Hook to fetch bookings summary
 */
export function useBookingsSummary(filters: ReportFilters = {}) {
    return useQuery<BookingsSummary, Error>({
        queryKey: adminReportsKeys.bookingsSummary(filters),
        queryFn: () => adminReportsFetchers.getBookingsSummary(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

// Re-export types and fetchers for convenience
export * from './fetchers';
