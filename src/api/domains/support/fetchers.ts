import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  SupportTicket,
  SupportMessage,
  CreateTicketInput,
  SupportTopic,
} from '@/types/support';
import { CustomerRoutes } from '@/lib/constants/routes';

export const supportFetchers = {
  async getTickets(): Promise<SupportTicket[]> {
    const { data } = await apiClient.get<ApiResponse<SupportTicket[]>>(
      `${CustomerRoutes.SUPPORT}/tickets`
    );
    return data.data!;
  },

  async createTicket(input: CreateTicketInput): Promise<SupportTicket> {
    const { data } = await apiClient.post<ApiResponse<SupportTicket>>(
      `${CustomerRoutes.SUPPORT}/tickets`,
      input
    );
    return data.data!;
  },

  async getTicketById(ticketId: string): Promise<SupportTicket> {
    const { data } = await apiClient.get<ApiResponse<SupportTicket>>(
      `${CustomerRoutes.SUPPORT}/tickets/${ticketId}`
    );
    return data.data!;
  },

  async getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
    const { data } = await apiClient.get<ApiResponse<SupportMessage[]>>(
      `${CustomerRoutes.SUPPORT}/tickets/${ticketId}/messages`
    );
    return data.data!;
  },

  async sendMessage(
    ticketId: string,
    message: string
  ): Promise<SupportMessage> {
    const { data } = await apiClient.post<ApiResponse<SupportMessage>>(
      `${CustomerRoutes.SUPPORT}/tickets/${ticketId}/messages`,
      { message }
    );
    return data.data!;
  },

  async getTopics(): Promise<SupportTopic[]> {
    const { data } = await apiClient.get<ApiResponse<SupportTopic[]>>(
      `${CustomerRoutes.SUPPORT}/topics`
    );
    return data.data!;
  },
};
