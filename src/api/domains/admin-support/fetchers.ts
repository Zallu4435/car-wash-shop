import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AdminFeedback,
  AdminTicket,
  AdminTicketDetail,
  UpdateTicketStatusInput,
  AddTicketMessageInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminSupportFetchers = {
  // Feedback
  async getFeedbackList(): Promise<AdminFeedback[]> {
    const { data } = await apiClient.get<ApiResponse<AdminFeedback[]>>(
      AdminRoutes.FEEDBACK
    );
    return data.data!;
  },

  async updateFeedbackStatus(
    feedbackId: string,
    status: 'pending' | 'reviewed' | 'resolved'
  ): Promise<AdminFeedback> {
    const { data } = await apiClient.patch<ApiResponse<AdminFeedback>>(
      `${AdminRoutes.FEEDBACK}/${feedbackId}`,
      { status }
    );
    return data.data!;
  },

  // Support Tickets
  async getTicketList(): Promise<AdminTicket[]> {
    const { data } = await apiClient.get<ApiResponse<AdminTicket[]>>(
      AdminRoutes.TICKETS
    );
    return data.data!;
  },

  async getTicketById(ticketId: string): Promise<AdminTicketDetail> {
    const { data } = await apiClient.get<ApiResponse<AdminTicketDetail>>(
      AdminRoutes.TICKET_DETAIL(ticketId)
    );
    return data.data!;
  },

  async updateTicketStatus(
    ticketId: string,
    input: UpdateTicketStatusInput
  ): Promise<AdminTicketDetail> {
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
    const { data } = await apiClient.post<ApiResponse<AdminTicketDetail>>(
      `${AdminRoutes.TICKET_DETAIL(ticketId)}/messages`,
      input
    );
    return data.data!;
  },
};
