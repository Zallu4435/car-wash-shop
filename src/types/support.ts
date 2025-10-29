export interface SupportTicket {
    id: string;
    userId: string;
    subject: string;
    description: string;
    topic: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SupportMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: 'user' | 'support';
    message: string;
    attachments?: string[];
    createdAt: string;
  }
  
  export interface CreateTicketInput {
    subject: string;
    description: string;
    topic: string;
    priority?: 'low' | 'medium' | 'high';
    attachments?: string[];
  }
  
  export interface SupportTopic {
    id: string;
    name: string;
    description?: string;
  }
  