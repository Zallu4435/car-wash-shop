import { BookingStatus } from '@/lib/constants/status';

export interface StaffDashboardSummary {
  todayJobs: number;
  weekJobs: number;
  earnings: number;
  rating: number;
  statsTrends: {
    todayJobs: string;
    weekJobs: string;
    earnings: string;
    rating: string;
  };
}

export interface StaffJob {
  id: string;
  service: string;
  customer: string;
  time: string;
  datetime: string;
  location: string;
  status: BookingStatus;
  amount?: number;
  rating?: number;
}

export interface StaffJobDetail {
  id: string;
  service: string;
  customer: {
    name: string;
    phone: string;
  };
  datetime: string;
  status: BookingStatus;
  notes: string[];
  location: string;
  amount?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
  vehicleDetails?: {
    category: 'car' | 'bike';
    bodyType: string;
  };
  paymentInfo?: {
    method: string;
    status: string;
    amount: number;
  };
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

export interface StaffJobFilters {
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateJobStatusInput {
  status: Exclude<BookingStatus, 'pending' | 'confirmed' | 'assigned'>;
  notes?: string;
}

export interface StaffPaymentSummary {
  totalEarnings: number;
  thisWeek: number;
  pendingPayments: number;
  history: Array<{
    date: string;
    amount: number;
    jobId?: string;
    service?: string;
  }>;
}

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
  totalJobs: number;
  avgRating: number;
  earnings: number;
  totalReviews?: number;
  avatar?: string;
  joinedDate?: string;
  achievements: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}

export interface UpdateStaffProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  area?: string;
  avatar?: string;
  availability?: {
    days?: string[];
    hours?: string;
  };
}

export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'job_assigned' | 'job_cancelled' | 'payment' | 'rating' | 'system';
  data?: Record<string, string | number | boolean | null | undefined>;
  read: boolean;
  createdAt: string;
}
