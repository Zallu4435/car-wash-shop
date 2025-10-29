export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'order' | 'promotion' | 'system';
    data?: Record<string, any>;
    read: boolean;
    actionUrl?: string;
    createdAt: string;
  }
  
  export interface NotificationFilters {
    type?: string;
    read?: boolean;
    page?: number;
    limit?: number;
  }
  