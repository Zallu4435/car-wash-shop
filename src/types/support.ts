import { TicketStatus, Priority, SenderType } from '@/lib/constants/status';

export interface SupportTicket {
    id: string;
    userId: string;
    subject: string;
    description: string;
    topic: string;
    priority: Priority;
    status: TicketStatus;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SupportMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: SenderType;
    message: string;
    attachments?: string[];
    createdAt: string;
  }
  
  export interface CreateTicketInput {
    subject: string;
    description: string;
    topic: string;
    priority?: Priority;
    attachments?: string[];
  }
  
  export interface SupportTopic {
    id: string;
    name: string;
    description?: string;
  }
  