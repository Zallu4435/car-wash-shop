import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffJobsFetchers } from './fetchers';
import type { StaffJobFilters, UpdateJobStatusInput } from '@/types/staff';
import { toast } from 'sonner';

export const staffJobsKeys = {
  all: ['staff-jobs'] as const,
  list: (filters?: StaffJobFilters) => [...staffJobsKeys.all, 'list', filters] as const,
  detail: (id: string) => [...staffJobsKeys.all, 'detail', id] as const,
  history: (filters?: StaffJobFilters) => [...staffJobsKeys.all, 'history', filters] as const,
};

export const useStaffJobs = (filters?: StaffJobFilters) => {
  return useQuery({
    queryKey: staffJobsKeys.list(filters),
    queryFn: () => staffJobsFetchers.getJobs(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useStaffJobDetail = (jobId: string) => {
  return useQuery({
    queryKey: staffJobsKeys.detail(jobId),
    queryFn: () => staffJobsFetchers.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, input }: { jobId: string; input: UpdateJobStatusInput }) =>
      staffJobsFetchers.updateJobStatus(jobId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(staffJobsKeys.detail(variables.jobId), data);
      queryClient.invalidateQueries({ queryKey: staffJobsKeys.all });
      toast.success('Job status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job status');
    },
  });
};

export const useStaffWorkHistory = (filters?: StaffJobFilters) => {
  return useQuery({
    queryKey: staffJobsKeys.history(filters),
    queryFn: () => staffJobsFetchers.getWorkHistory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
