import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Notification, NotificationFilters } from '@/types/notification';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockNotifications } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const notificationFetchers = {
  async getNotifications(
    filters?: NotificationFilters
  ): Promise<PaginatedResponse<Notification>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredNotifications = [...mockNotifications];
      
      // Filter by read status if specified
      if (filters?.read !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.read === filters.read);
      }
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 5; // Show 5 notifications per page for better infinite scroll demo
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
      
      return {
        data: paginatedNotifications,
        total: filteredNotifications.length,
        page,
        limit,
        totalPages: Math.ceil(filteredNotifications.length / limit),
      };
    }
    
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Notification>>
    >(CustomerRoutes.NOTIFICATIONS, { params: filters });
    return data.data!;
  },

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { message: 'Notification marked as read' };
    }
    
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.NOTIFICATIONS}/${notificationId}/${CustomerRoutes.NOTIFICATIONS_READ}`
    );
    return data.data!;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Marking all notifications as read');
      return { message: 'All notifications marked as read' };
    }
    
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.NOTIFICATIONS}/${CustomerRoutes.NOTIFICATIONS_READ_ALL}`
    );
    return data.data!;
  },
};
