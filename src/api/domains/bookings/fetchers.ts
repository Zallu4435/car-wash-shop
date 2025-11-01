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
import { mockBookings } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const bookingFetchers = {
  async createBooking(input: BookingInput): Promise<Booking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock booking
      const scheduledDate = new Date(input.scheduledAt);
      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        bookingNumber: `BK${Date.now()}`,
        userId: 'user_001',
        serviceId: input.serviceId,
        serviceName: 'Car Wash Service',
        vehicleId: input.vehicleId,
        addressId: input.addressId,
        address: 'Mock Address',
        scheduledAt: input.scheduledAt,
        scheduledDate: scheduledDate.toLocaleDateString(),
        scheduledTime: scheduledDate.toLocaleTimeString(),
        status: BOOKING_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        amount: 500,
        totalAmount: 500,
        notes: input.notes,
        vehicleDetails: {
          make: 'Mock',
          model: 'Vehicle',
          year: 2024,
          type: 'car'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;
      
      return newBooking;
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock available slots in 24-hour format (HH:MM)
      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      ];
      
      const bookedSlots = ['10:00', '14:00'];
      
      return {
        date,
        slots: allSlots.map(time => ({
          startTime: time,
          endTime: time, // In real API, this would be different
          isAvailable: !bookedSlots.includes(time),
        })),
      };
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Booking cancelled successfully' };
    }
    
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `/bookings/${bookingId}/cancel`
    );
    return data.data!;
  },
};
