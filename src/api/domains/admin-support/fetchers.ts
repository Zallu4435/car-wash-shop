import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminFeedback,
  AdminTicket,
  AdminTicketDetail,
  UpdateTicketStatusInput,
  AddTicketMessageInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockFeedback: AdminFeedback[] = [
  {
    id: 'FB001',
    customerId: 'CUST001',
    customerName: 'Rajesh Kumar',
    bookingId: 'BK001',
    rating: 5,
    comment: 'Excellent service! Very professional staff.',
    status: 'reviewed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FB002',
    customerId: 'CUST002',
    customerName: 'Priya Sharma',
    bookingId: 'BK002',
    rating: 4,
    comment: 'Good service but took longer than expected.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FB003',
    customerId: 'CUST003',
    customerName: 'Amit Patel',
    bookingId: 'BK003',
    rating: 5,
    comment: 'Outstanding work! Will definitely book again.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTickets: AdminTicket[] = [
  {
    id: 'TKT001',
    ticketNumber: 'TKT-2024-001',
    customerId: 'CUST001',
    customerName: 'Rajesh Kumar',
    subject: 'Payment not reflected',
    description: 'I made a payment but it is not showing in my account.',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TKT002',
    ticketNumber: 'TKT-2024-002',
    customerId: 'CUST002',
    customerName: 'Priya Sharma',
    subject: 'Booking cancellation issue',
    description: 'Unable to cancel my booking from the app.',
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

const mockTicketDetails: Record<string, AdminTicketDetail> = {
  TKT001: {
    ...mockTickets[0],
    messages: [
      {
        id: 'MSG001',
        sender: 'Rajesh Kumar',
        senderType: 'customer',
        message: 'I made a payment of ₹599 but it is not showing in my account.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'MSG002',
        sender: 'Support Team',
        senderType: 'admin',
        message: 'We are looking into this issue. Please provide your transaction ID.',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
};

export const adminSupportFetchers = {
  // Feedback
  async getFeedbackList(filters?: {
    search?: string;
    type?: string;
    rating?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminFeedback>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredFeedback = [...mockFeedback];

      // Apply filters
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredFeedback = filteredFeedback.filter(f =>
          f.customerName.toLowerCase().includes(searchLower) ||
          f.comment?.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.rating) {
        if (filters.rating === '5') {
          filteredFeedback = filteredFeedback.filter(f => f.rating === 5);
        } else if (filters.rating === '4') {
          filteredFeedback = filteredFeedback.filter(f => f.rating === 4);
        } else if (filters.rating === '3') {
          filteredFeedback = filteredFeedback.filter(f => f.rating <= 3);
        }
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

      return {
        data: paginatedFeedback,
        total: filteredFeedback.length,
        page,
        limit,
        totalPages: Math.ceil(filteredFeedback.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminFeedback>>>(
      AdminRoutes.FEEDBACK,
      { params: filters }
    );
    return data.data!;
  },

  async updateFeedbackStatus(
    feedbackId: string,
    status: 'pending' | 'reviewed' | 'resolved'
  ): Promise<AdminFeedback> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const feedback = mockFeedback.find(f => f.id === feedbackId);
      if (!feedback) throw new Error('Feedback not found');
      return { ...feedback, status };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminFeedback>>(
      `${AdminRoutes.FEEDBACK}/${feedbackId}`,
      { status }
    );
    return data.data!;
  },

  // Support Tickets
  async getTicketList(filters?: {
    search?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminTicket>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredTickets = [...mockTickets];

      // Apply filters
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTickets = filteredTickets.filter(t =>
          t.ticketNumber.toLowerCase().includes(searchLower) ||
          t.customerName.toLowerCase().includes(searchLower) ||
          t.subject.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.status) {
        filteredTickets = filteredTickets.filter(t => t.status === filters.status);
      }
      if (filters?.priority) {
        filteredTickets = filteredTickets.filter(t => t.priority === filters.priority);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

      return {
        data: paginatedTickets,
        total: filteredTickets.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTickets.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminTicket>>>(
      AdminRoutes.TICKETS,
      { params: filters }
    );
    return data.data!;
  },

  async getTicketById(ticketId: string): Promise<AdminTicketDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTicketDetails[ticketId];
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }

    const { data } = await apiClient.get<ApiResponse<AdminTicketDetail>>(
      AdminRoutes.TICKET_DETAIL(ticketId)
    );
    return data.data!;
  },

  async updateTicketStatus(
    ticketId: string,
    input: UpdateTicketStatusInput
  ): Promise<AdminTicketDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = mockTicketDetails[ticketId];
      if (!ticket) throw new Error('Ticket not found');
      return { ...ticket, status: input.status, updatedAt: new Date().toISOString() };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminTicketDetail>>(
      AdminRoutes.TICKET_DETAIL(ticketId),
      input
    );
    return data.data!;
  },

  async addTicketMessage(
    ticketId: string,
    input: AddTicketMessageInput
  ): Promise<AdminTicketDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticket = mockTicketDetails[ticketId];
      if (!ticket) throw new Error('Ticket not found');
      return {
        ...ticket,
        messages: [
          ...ticket.messages,
          {
            id: `MSG${String(ticket.messages.length + 1).padStart(3, '0')}`,
            sender: 'Support Team',
            senderType: 'admin' as const,
            message: input.message,
            timestamp: new Date().toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await apiClient.post<ApiResponse<AdminTicketDetail>>(
      `${AdminRoutes.TICKET_DETAIL(ticketId)}/messages`,
      input
    );
    return data.data!;
  },
};
