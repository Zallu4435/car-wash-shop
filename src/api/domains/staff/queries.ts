import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffFetchers } from './fetchers';
import type {
  StaffJobFilters,
  UpdateJobStatusInput,
  UpdateStaffProfileInput,
} from '@/types/staff';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tokenManager } from '@/api/client';
import { StaffRoutes } from '@/lib/constants/routes';

// Query Keys
export const staffKeys = {
  all: ['staff'] as const,
  dashboard: () => [...staffKeys.all, 'dashboard'] as const,
  upcomingJobs: () => [...staffKeys.all, 'upcoming-jobs'] as const,
  jobs: () => [...staffKeys.all, 'jobs'] as const,
  jobsList: (filters?: StaffJobFilters) => [...staffKeys.jobs(), 'list', filters] as const,
  jobDetail: (id: string) => [...staffKeys.jobs(), 'detail', id] as const,
  payments: () => [...staffKeys.all, 'payments'] as const,
  history: (filters?: StaffJobFilters) => [...staffKeys.all, 'history', filters] as const,
  profile: () => [...staffKeys.all, 'profile'] as const,
  notifications: () => [...staffKeys.all, 'notifications'] as const,
};

// Dashboard Queries
export const useStaffDashboard = () => {
  return useQuery({
    queryKey: staffKeys.dashboard(),
    queryFn: staffFetchers.getDashboardSummary,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useUpcomingJobs = () => {
  return useQuery({
    queryKey: staffKeys.upcomingJobs(),
    queryFn: staffFetchers.getUpcomingJobs,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Jobs Queries
export const useStaffJobs = (filters?: StaffJobFilters) => {
  return useQuery({
    queryKey: staffKeys.jobsList(filters),
    queryFn: () => staffFetchers.getJobs(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
};

export const useStaffJob = (jobId: string) => {
  return useQuery({
    queryKey: staffKeys.jobDetail(jobId),
    queryFn: () => staffFetchers.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, input }: { jobId: string; input: UpdateJobStatusInput }) =>
      staffFetchers.updateJobStatus(jobId, input),
    onSuccess: (data, variables) => {
      // Update the specific job detail
      queryClient.setQueryData(staffKeys.jobDetail(variables.jobId), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: staffKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: staffKeys.upcomingJobs() });
      queryClient.invalidateQueries({ queryKey: staffKeys.dashboard() });
      
      toast.success('Job status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job status');
    },
  });
};

// Payments Queries
export const useStaffPayments = () => {
  return useQuery({
    queryKey: staffKeys.payments(),
    queryFn: staffFetchers.getPaymentSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// History Queries
export const useStaffHistory = (filters?: StaffJobFilters) => {
  return useQuery({
    queryKey: staffKeys.history(filters),
    queryFn: () => staffFetchers.getWorkHistory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Profile Queries
export const useStaffProfile = () => {
  return useQuery({
    queryKey: staffKeys.profile(),
    queryFn: staffFetchers.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateStaffProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStaffProfileInput) =>
      staffFetchers.updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(staffKeys.profile(), data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useStaffLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: staffFetchers.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push(StaffRoutes.LOGIN);
    },
  });
};

// Notifications Queries
export const useStaffNotifications = () => {
  return useQuery({
    queryKey: staffKeys.notifications(),
    queryFn: staffFetchers.getNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useMarkStaffNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      staffFetchers.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.notifications() });
    },
  });
};
