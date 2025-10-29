import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminBooking,
  AdminBookingDetail,
  AssignStaffInput,
  BookingFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminRequestsFetchers = {
  async getBookingList(filters?: BookingFilters): Promise<PaginatedResponse<AdminBooking>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminBooking>>>(
      AdminRoutes.REQUESTS,
      { params: filters }
    );
    return data.data!;
  },

  async getBookingById(bookingId: string): Promise<AdminBookingDetail> {
    const { data } = await apiClient.get<ApiResponse<AdminBookingDetail>>(
      AdminRoutes.REQUEST_DETAIL(bookingId)
    );
    return data.data!;
  },

  async assignStaffToBooking(
    bookingId: string,
    input: AssignStaffInput
  ): Promise<AdminBookingDetail> {
    const { data } = await apiClient.post<ApiResponse<AdminBookingDetail>>(
      AdminRoutes.REQUEST_ASSIGN(bookingId),
      input
    );
    return data.data!;
  },

  async updateBookingStatus(
    bookingId: string,
    status: string,
    note?: string
  ): Promise<AdminBookingDetail> {
    const { data } = await apiClient.patch<ApiResponse<AdminBookingDetail>>(
      AdminRoutes.REQUEST_DETAIL(bookingId),
      { status, note }
    );
    return data.data!;
  },
};
