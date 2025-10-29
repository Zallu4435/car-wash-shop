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
import { mockBookings } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      return booking as any;
    }
    
    const { data } = await apiClient.get<ApiResponse<Booking>>(
      `/bookings/${bookingId}`
    );
    return data.data!;
  },

  async getUserBookings(
    filters?: BookingFilters
  ): Promise<PaginatedResponse<Booking>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredBookings = [...mockBookings];
      
      if (filters?.status) {
        filteredBookings = filteredBookings.filter(b => b.status === filters.status);
      }
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedBookings = filteredBookings.slice(startIndex, startIndex + limit);
      
      return {
        data: paginatedBookings as any,
        total: filteredBookings.length,
        page,
        limit,
        totalPages: Math.ceil(filteredBookings.length / limit),
      };
    }
    
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      CustomerRoutes.BOOKINGS,
      { params: filters }
    );
    return data.data!;
  },

  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `/bookings/${bookingId}/cancel`
    );
    return data.data!;
  },
};
