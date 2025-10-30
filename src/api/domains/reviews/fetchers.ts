import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface ReviewInput {
  orderId?: string;
  bookingId?: string;
  productId?: string;
  serviceId?: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  orderId?: string;
  bookingId?: string;
  productId?: string;
  serviceId?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const reviewFetchers = {
  async submitReview(input: ReviewInput): Promise<Review> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview: Review = {
        id: `review_${Date.now()}`,
        userId: 'user_001',
        userName: 'John Doe',
        orderId: input.orderId,
        bookingId: input.bookingId,
        productId: input.productId,
        serviceId: input.serviceId,
        rating: input.rating,
        comment: input.comment,
        images: input.images || [],
        createdAt: new Date().toISOString(),
      };
      
      return newReview;
    }
    
    const { data } = await apiClient.post<ApiResponse<Review>>(
      '/reviews',
      input
    );
    return data.data!;
  },

  async getReviewByOrderId(orderId: string): Promise<Review | null> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return null; // No existing review in mock
    }
    
    try {
      const { data } = await apiClient.get<ApiResponse<Review>>(
        `/reviews/order/${orderId}`
      );
      return data.data!;
    } catch (error) {
      return null;
    }
  },

  async getReviewByBookingId(bookingId: string): Promise<Review | null> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return null; // No existing review in mock
    }
    
    try {
      const { data } = await apiClient.get<ApiResponse<Review>>(
        `/reviews/booking/${bookingId}`
      );
      return data.data!;
    } catch (error) {
      return null;
    }
  },

  async updateReview(reviewId: string, input: Partial<ReviewInput>): Promise<Review> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReview: Review = {
        id: reviewId,
        userId: 'user_001',
        userName: 'John Doe',
        rating: input.rating || 5,
        comment: input.comment || '',
        images: input.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return updatedReview;
    }
    
    const { data } = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${reviewId}`,
      input
    );
    return data.data!;
  },

  async deleteReview(reviewId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Review deleted successfully' };
    }
    
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/reviews/${reviewId}`
    );
    return data.data!;
  },

  async getReviewsByProductId(productId: string): Promise<Review[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock reviews
      return [
        {
          id: 'review_1',
          userId: 'user_002',
          userName: 'Sarah Johnson',
          productId,
          rating: 5,
          comment: 'Excellent product! The quality exceeded my expectations. Highly recommended for anyone looking for a reliable solution.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'review_2',
          userId: 'user_003',
          userName: 'Mike Chen',
          productId,
          rating: 4,
          comment: 'Very good product overall. Fast delivery and great customer service. Only minor issue was the packaging.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'review_3',
          userId: 'user_004',
          userName: 'Emma Wilson',
          productId,
          rating: 5,
          comment: 'Amazing! This product has made my life so much easier. Worth every penny.',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    
    const { data } = await apiClient.get<ApiResponse<Review[]>>(
      `/reviews/product/${productId}`
    );
    return data.data!;
  },

  async getReviewsByServiceId(serviceId: string): Promise<Review[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock reviews
      return [
        {
          id: 'review_4',
          userId: 'user_005',
          userName: 'David Kumar',
          serviceId,
          rating: 5,
          comment: 'Outstanding service! The team was professional, punctual, and did an excellent job. My car looks brand new!',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'review_5',
          userId: 'user_006',
          userName: 'Lisa Anderson',
          serviceId,
          rating: 4,
          comment: 'Great service overall. The staff was friendly and the results were impressive. Will definitely use again.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'review_6',
          userId: 'user_007',
          userName: 'James Taylor',
          serviceId,
          rating: 5,
          comment: 'Absolutely fantastic! Best car wash service I have ever used. Attention to detail is remarkable.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'review_7',
          userId: 'user_008',
          userName: 'Priya Sharma',
          serviceId,
          rating: 3,
          comment: 'Service was okay. Got the job done but expected a bit more for the price. Staff could be more attentive.',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
    
    const { data } = await apiClient.get<ApiResponse<Review[]>>(
      `/reviews/service/${serviceId}`
    );
    return data.data!;
  },
};
