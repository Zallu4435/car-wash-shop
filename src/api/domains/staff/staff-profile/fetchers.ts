import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  StaffProfile,
  UpdateStaffProfileInput,
  StaffNotification,
} from '@/types/staff';
import { StaffRoutes, CustomerRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockProfile: StaffProfile = {
  id: 'STAFF001',
  name: 'Ramesh Kumar',
  role: 'Senior Technician',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@carwash.com',
  area: 'Koramangala & HSR Layout',
  totalJobs: 342,
  avgRating: 4.8,
  earnings: 45680,
  totalReviews: 156,
  avatar: '/images/avatars/staff-avatar.jpg',
  joinedDate: '2023-06-15T00:00:00.000Z',
  achievements: [
    { label: 'Top Performer', value: 'This Month', icon: '🏆' },
    { label: 'Customer Favorite', value: '4.8 Rating', icon: '⭐' },
    { label: 'Quick Service', value: 'Avg 45 min', icon: '⚡' },
    { label: 'Eco Warrior', value: '100% Green', icon: '🌿' },
  ],
  skills: ['Premium Detailing', 'Interior Cleaning', 'Waxing & Polishing', 'Bike Washing', 'Eco-Friendly Products'],
  availability: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    hours: '9:00 AM - 6:00 PM',
  },
};

const mockNotifications: StaffNotification[] = [
  {
    id: 'NOTIF001',
    title: 'New Job Assigned',
    message: 'Premium Car Wash at Koramangala scheduled for 10:00 AM today',
    type: 'job_assigned',
    data: { jobId: 'JOB001' },
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF002',
    title: 'Payment Received',
    message: 'You received ₹1,798 for completed jobs',
    type: 'payment',
    data: { amount: 1798 },
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF003',
    title: '5-Star Rating!',
    message: 'Customer Anita Desai gave you 5 stars for excellent service',
    type: 'rating',
    data: { rating: 5, jobId: 'JOB101' },
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF004',
    title: 'Job Cancelled',
    message: 'Job JOB203 has been cancelled by the customer',
    type: 'job_cancelled',
    data: { jobId: 'JOB203' },
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOTIF005',
    title: 'System Update',
    message: 'New features added to the staff app. Check them out!',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const staffProfileFetchers = {
  async getProfile(): Promise<StaffProfile> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProfile;
    }

    const { data } = await apiClient.get<ApiResponse<StaffProfile>>(
      StaffRoutes.PROFILE
    );
    return data.data!;
  },

  async updateProfile(input: UpdateStaffProfileInput): Promise<StaffProfile> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        ...mockProfile, 
        ...input,
        availability: input.availability ? {
          days: input.availability.days || mockProfile.availability!.days,
          hours: input.availability.hours || mockProfile.availability!.hours,
        } : mockProfile.availability,
      };
    }

    const { data } = await apiClient.patch<ApiResponse<StaffProfile>>(
      StaffRoutes.PROFILE,
      input
    );
    return data.data!;
  },

  async logout(): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Clear cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; path=/; max-age=0';
        document.cookie = 'auth_role=; path=/; max-age=0';
      }
      return { message: 'Logged out successfully' };
    }

    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      CustomerRoutes.AUTH_LOGOUT
    );
    return data.data!;
  },

  async getNotifications(): Promise<StaffNotification[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNotifications;
    }

    const { data } = await apiClient.get<ApiResponse<StaffNotification[]>>(
      StaffRoutes.NOTIFICATIONS
    );
    return data.data!;
  },

  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
      return { message: 'Notification marked as read' };
    }

    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      StaffRoutes.MARK_NOTIFICATION_AS_READ,
      { notificationId }
    );
    return data.data!;
  },
};
