import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Booking,
  BookingInput,
  BookingPreview,
  AvailableSlotsResponse,
  BookingFilters,
} from '@/types/booking';
import { CustomerRoutes } from '@/lib/constants/routes';
import { BOOKING_STATUS, PAYMENT_STATUS } from '@/lib/constants/status';
// Booking endpoints are now fully backed by API; no mocks

export const bookingFetchers = {
  async createBooking(input: BookingInput): Promise<Booking> {
    const { data } = await apiClient.post<ApiResponse<Booking>>(
      CustomerRoutes.BOOKINGS,
      input
    );
    return data.data!;
  },

  async getBookingPreview(input: Partial<BookingInput>): Promise<BookingPreview> {
    const { data } = await apiClient.post<ApiResponse<BookingPreview>>(
      CustomerRoutes.BOOKINGS_PREVIEW,
      input
    );
    return data.data!;
  },

  async getAvailableDays(
    serviceId: string,
    daysAhead?: number
  ): Promise<{ availableDays: string[] }> {
    const { data } = await apiClient.get<ApiResponse<{ availableDays: string[] }>>(
      `${CustomerRoutes.BOOKINGS}/available-days`,
      { params: { serviceId, daysAhead } }
    );
    return data.data!;
  },

  async getAvailableSlots(
    serviceId: string,
    date: string
  ): Promise<AvailableSlotsResponse> {
    const { data } = await apiClient.get<ApiResponse<AvailableSlotsResponse>>(
      CustomerRoutes.BOOKINGS_SLOTS,
      { params: { serviceId, date } }
    );
    return data.data!;
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const { data } = await apiClient.get<ApiResponse<Booking>>(
      `${CustomerRoutes.BOOKINGS}/${bookingId}`
    );
    return data.data!;
  },

  async getUserBookings(
    filters?: BookingFilters
  ): Promise<PaginatedResponse<Booking>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      CustomerRoutes.BOOKINGS,
      { params: filters }
    );
    return data.data!;
  },

  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.BOOKINGS}/${bookingId}/cancel`
    );
    return data.data!;
  },
};
