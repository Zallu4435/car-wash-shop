import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminBooking,
  AdminBookingDetail,
  AssignStaffInput,
  BookingFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Removed local mock state for slots; using API-only for admin slot management

// Mock data
const mockBookings: AdminBooking[] = [
  {
    id: 'BK001',
    bookingNumber: 'BK-2024-001',
    customer: 'Rajesh Kumar',
    customerId: 'CUST001',
    service: 'Premium Car Wash',
    serviceId: 'SRV001',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:00 AM',
    status: 'confirmed',
    assignedStaff: 'Ramesh Kumar',
    assignedStaffId: 'STF001',
    amount: 599,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK002',
    bookingNumber: 'BK-2024-002',
    customer: 'Priya Sharma',
    customerId: 'CUST002',
    service: 'Interior Detailing',
    serviceId: 'SRV002',
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '2:00 PM',
    status: 'pending',
    amount: 899,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK003',
    bookingNumber: 'BK-2024-003',
    customer: 'Amit Patel',
    customerId: 'CUST003',
    service: 'Full Service',
    serviceId: 'SRV003',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '11:00 AM',
    status: 'assigned',
    assignedStaff: 'Suresh Patel',
    assignedStaffId: 'STF002',
    amount: 1299,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'BK004',
    bookingNumber: 'BK-2024-004',
    customer: 'Sneha Reddy',
    customerId: 'CUST004',
    service: 'Express Wash',
    serviceId: 'SRV004',
    scheduledDate: new Date(Date.now()).toISOString().split('T')[0],
    scheduledTime: '4:00 PM',
    status: 'in_progress',
    assignedStaff: 'Vijay Singh',
    assignedStaffId: 'STF003',
    amount: 399,
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

const mockBookingDetails: Record<string, AdminBookingDetail> = {
  BK001: {
    ...mockBookings[0],
    customerDetails: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gmail.com',
      phone: '+91 98765 43210',
    },
    vehicleDetails: {
      brand: 'Honda',
      model: 'City',
      number: 'KA-01-AB-1234',
      type: 'Sedan',
    },
    address: '123, MG Road, Koramangala, Bangalore - 560034',
    notes: 'Customer prefers eco-friendly products',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Booking created',
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        note: 'Booking confirmed and staff assigned',
      },
    ],
  },
};

export const adminRequestsFetchers = {
  async getBookingList(filters?: BookingFilters): Promise<PaginatedResponse<AdminBooking>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredBookings = [...mockBookings];

      // Apply filters
      if (filters?.status) {
        filteredBookings = filteredBookings.filter(b => b.status === filters.status);
      }
      if (filters?.staffId) {
        filteredBookings = filteredBookings.filter(b => b.assignedStaffId === filters.staffId);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredBookings = filteredBookings.filter(b =>
          b.bookingNumber.toLowerCase().includes(searchLower) ||
          b.customer.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.fromDate) {
        filteredBookings = filteredBookings.filter(b => b.scheduledDate >= filters.fromDate!);
      }
      if (filters?.toDate) {
        filteredBookings = filteredBookings.filter(b => b.scheduledDate <= filters.toDate!);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

      return {
        data: paginatedBookings,
        total: filteredBookings.length,
        page,
        limit,
        totalPages: Math.ceil(filteredBookings.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminBooking>>>(
      '/admin/requests',
      { params: filters }
    );
    return data.data!;
  },

  async getBookingById(bookingId: string): Promise<AdminBookingDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const bookingDetail = mockBookingDetails[bookingId];
      if (!bookingDetail) {
        throw new Error('Booking not found');
      }
      return bookingDetail;
    }

    const { data } = await apiClient.get<ApiResponse<AdminBookingDetail>>(
      `/admin/requests/${bookingId}`
    );
    return data.data!;
  },

  async assignStaffToBooking(
    bookingId: string,
    input: AssignStaffInput
  ): Promise<AdminBookingDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bookingDetail = mockBookingDetails[bookingId];
      if (!bookingDetail) {
        throw new Error('Booking not found');
      }
      return {
        ...bookingDetail,
        assignedStaffId: input.staffId,
        assignedStaff: 'Staff Member',
        status: 'assigned',
        statusHistory: [
          ...bookingDetail.statusHistory,
          {
            status: 'assigned',
            timestamp: new Date().toISOString(),
            note: input.notes || 'Staff assigned to booking',
          },
        ],
      };
    }

    const { data } = await apiClient.post<ApiResponse<AdminBookingDetail>>(
      `/admin/requests/${bookingId}/assign`,
      input
    );
    return data.data!;
  },

  async updateBookingStatus(
    bookingId: string,
    status: string,
    note?: string
  ): Promise<AdminBookingDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bookingDetail = mockBookingDetails[bookingId];
      if (!bookingDetail) {
        throw new Error('Booking not found');
      }
      return {
        ...bookingDetail,
        status: status as any,
        statusHistory: [
          ...bookingDetail.statusHistory,
          {
            status,
            timestamp: new Date().toISOString(),
            note,
          },
        ],
      };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminBookingDetail>>(
      `/admin/requests/${bookingId}/status`,
      { status, note }
    );
    return data.data!;
  },

  // Slots Management
  async getSlots(date: string): Promise<{ slots: Array<{ id: string; time: string; status: 'available' | 'unavailable'; booked: boolean; capacity?: number }> }> {
    const { data } = await apiClient.get<ApiResponse<{ slots: Array<any> }>>(
      '/admin/requests/slots',
      { params: { date } }
    );
    const slots = (data.data?.slots || []).map((slot: any) => ({
      id: slot._id || slot.id,
      time: slot.time,
      status: slot.status || 'unavailable',
      booked: Boolean(slot.booked),
      capacity: slot.capacity,
    }));
    return { slots };
  },

  async createSlots(input: {
    startDate: string;
    endDate: string;
    weekdayStartTime: string;
    weekdayEndTime: string;
    weekendStartTime: string;
    weekendEndTime: string;
    initialStatus: 'available' | 'unavailable';
  }): Promise<{ slots: Array<any>; daysGenerated?: number; totalSlotsCreated?: number }> {
    const { data } = await apiClient.post<ApiResponse<{ slots: Array<any>; daysGenerated?: number; totalSlotsCreated?: number }>>(
      '/admin/requests/slots',
      input
    );
    const slots = (data.data?.slots || []).map((slot: any) => ({
      id: slot._id || slot.id,
      time: slot.time,
      status: slot.status || 'unavailable',
      booked: Boolean(slot.booked),
      capacity: slot.capacity,
    }));
    return {
      slots,
      daysGenerated: data.data?.daysGenerated,
      totalSlotsCreated: data.data?.totalSlotsCreated,
    };
  },

  async updateSlot(slotId: string, input: { status?: 'available' | 'unavailable'; booked?: boolean }): Promise<{ slot: any }> {
    const { data } = await apiClient.patch<ApiResponse<any>>(
      `/admin/requests/slots/${slotId}`,
      input
    );
    const slot = data.data;
    return {
      slot: {
        id: slot._id || slot.id,
        time: slot.time,
        status: slot.status || 'unavailable',
        booked: Boolean(slot.booked),
        capacity: slot.capacity,
      },
    };
  },

  async updateSlotsStatus(input: { date: string; status: 'available' | 'unavailable' }): Promise<{ slots: Array<any> }> {
    const { data } = await apiClient.post<ApiResponse<{ slots: Array<any> }>>(
      '/admin/requests/slots/bulk-status',
      input
    );
    const slots = (data.data?.slots || []).map((slot: any) => ({
      id: slot._id || slot.id,
      time: slot.time,
      status: slot.status || 'unavailable',
      booked: Boolean(slot.booked),
      capacity: slot.capacity,
    }));
    return { slots };
  },

  async removeStaffAssignment(bookingId: string): Promise<AdminBookingDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bookingDetail = mockBookingDetails[bookingId];
      if (!bookingDetail) {
        throw new Error('Booking not found');
      }
      return {
        ...bookingDetail,
        assignedStaffId: null,
        assignedStaff: null,
        status: 'pending',
      };
    }

    const { data } = await apiClient.delete<ApiResponse<AdminBookingDetail>>(
      `/admin/requests/${bookingId}/assign`
    );
    return data.data!;
  },
};
