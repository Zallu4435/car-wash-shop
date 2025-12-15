import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { AdminFeedback } from '@/types/admin';
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
    feedbackType: 'service',
    type: 'Compliment',
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
    feedbackType: 'service',
    type: 'Suggestion',
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
    feedbackType: 'service',
    type: 'Compliment',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FB004',
    customerId: 'CUST004',
    customerName: 'Sneha Reddy',
    bookingId: 'BK004',
    rating: 5,
    comment: 'Great quality car shampoo! Highly recommend.',
    status: 'reviewed',
    feedbackType: 'product',
    type: 'Compliment',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FB005',
    customerId: 'CUST005',
    customerName: 'Vikram Singh',
    bookingId: 'BK005',
    rating: 4,
    comment: 'Good product but packaging could be better.',
    status: 'pending',
    feedbackType: 'product',
    type: 'Suggestion',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FB006',
    customerId: 'CUST006',
    customerName: 'Ananya Iyer',
    bookingId: 'BK006',
    rating: 5,
    comment: 'Excellent microfiber cloths! Very soft and effective.',
    status: 'resolved',
    feedbackType: 'product',
    type: 'Compliment',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
      if (filters?.type) {
        filteredFeedback = filteredFeedback.filter(f => f.feedbackType === filters.type);
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
};
