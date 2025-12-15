import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

// Reports API routes
const REPORTS_BASE = '/admin/reports';

// Types for report data
export interface ReportFilters {
    preset?: 'today' | 'week' | 'month' | 'year' | 'all';
    startDate?: string;
    endDate?: string;
    status?: string;
    paymentStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface OrderReportItem {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    itemsCount: number;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    tax: number;
    shippingFee: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
}

export interface BookingReportItem {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceName: string;
    vehicleCategory: string;
    vehicleBodyType: string;
    scheduledAt: string;
    addOnsCount: number;
    amount: number;
    totalAmount: number;
    paymentType: string;
    paymentStatus: string;
    status: string;
    staffName: string;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface OrdersReportResponse {
    orders: OrderReportItem[];
    pagination: Pagination;
}

export interface BookingsReportResponse {
    bookings: BookingReportItem[];
    pagination: Pagination;
}

export interface StatusBreakdown {
    status: string;
    count: number;
}

export interface OrdersSummary {
    totalCount: number;
    totalRevenue: number;
    avgOrderValue: number;
    totalDiscount: number;
    totalTax: number;
    totalShipping: number;
    statusBreakdown: StatusBreakdown[];
}

export interface BookingsSummary {
    totalCount: number;
    totalRevenue: number;
    avgBookingValue: number;
    statusBreakdown: StatusBreakdown[];
}

// Helper to build query string
const buildQueryParams = (filters: ReportFilters): Record<string, string> => {
    const params: Record<string, string> = {};
    if (filters.preset) params.preset = filters.preset;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);
    return params;
};

export const adminReportsFetchers = {
    /**
     * Get orders report with filters
     */
    async getOrdersReport(filters: ReportFilters = {}): Promise<OrdersReportResponse> {
        const { data } = await apiClient.get<ApiResponse<OrdersReportResponse>>(
            `${REPORTS_BASE}/orders`,
            { params: buildQueryParams(filters) }
        );
        return data.data!;
    },

    /**
     * Get bookings report with filters
     */
    async getBookingsReport(filters: ReportFilters = {}): Promise<BookingsReportResponse> {
        const { data } = await apiClient.get<ApiResponse<BookingsReportResponse>>(
            `${REPORTS_BASE}/bookings`,
            { params: buildQueryParams(filters) }
        );
        return data.data!;
    },

    /**
     * Get orders summary
     */
    async getOrdersSummary(filters: ReportFilters = {}): Promise<OrdersSummary> {
        const { data } = await apiClient.get<ApiResponse<OrdersSummary>>(
            `${REPORTS_BASE}/orders/summary`,
            { params: buildQueryParams(filters) }
        );
        return data.data!;
    },

    /**
     * Get bookings summary
     */
    async getBookingsSummary(filters: ReportFilters = {}): Promise<BookingsSummary> {
        const { data } = await apiClient.get<ApiResponse<BookingsSummary>>(
            `${REPORTS_BASE}/bookings/summary`,
            { params: buildQueryParams(filters) }
        );
        return data.data!;
    },

    /**
     * Export orders as PDF (triggers download)
     */
    async exportOrdersPdf(filters: ReportFilters = {}): Promise<void> {
        const response = await apiClient.get(
            `${REPORTS_BASE}/orders/export/pdf`,
            {
                params: buildQueryParams(filters),
                responseType: 'blob'
            }
        );
        downloadBlob(response.data, `orders-report-${Date.now()}.pdf`, 'application/pdf');
    },

    /**
     * Export orders as CSV (triggers download)
     */
    async exportOrdersCsv(filters: ReportFilters = {}): Promise<void> {
        const response = await apiClient.get(
            `${REPORTS_BASE}/orders/export/csv`,
            {
                params: buildQueryParams(filters),
                responseType: 'blob'
            }
        );
        downloadBlob(response.data, `orders-report-${Date.now()}.csv`, 'text/csv');
    },

    /**
     * Export bookings as PDF (triggers download)
     */
    async exportBookingsPdf(filters: ReportFilters = {}): Promise<void> {
        const response = await apiClient.get(
            `${REPORTS_BASE}/bookings/export/pdf`,
            {
                params: buildQueryParams(filters),
                responseType: 'blob'
            }
        );
        downloadBlob(response.data, `bookings-report-${Date.now()}.pdf`, 'application/pdf');
    },

    /**
     * Export bookings as CSV (triggers download)
     */
    async exportBookingsCsv(filters: ReportFilters = {}): Promise<void> {
        const response = await apiClient.get(
            `${REPORTS_BASE}/bookings/export/csv`,
            {
                params: buildQueryParams(filters),
                responseType: 'blob'
            }
        );
        downloadBlob(response.data, `bookings-report-${Date.now()}.csv`, 'text/csv');
    },
};

/**
 * Helper function to download a blob as a file
 */
function downloadBlob(data: Blob, filename: string, mimeType: string): void {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
