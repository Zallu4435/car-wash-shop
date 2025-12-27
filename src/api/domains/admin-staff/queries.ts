import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminStaffFetchers } from './fetchers';
import type { StaffFilters, CreateStaffInput, UpdateStaffInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminStaffKeys = {
  all: ['admin-staff'] as const,
  list: (filters?: StaffFilters) => [...adminStaffKeys.all, 'list', filters] as const,
  detail: (id: string) => [...adminStaffKeys.all, 'detail', id] as const,
};

export const useAdminStaffList = (filters?: StaffFilters) => {
  return useQuery({
    queryKey: adminStaffKeys.list(filters),
    queryFn: () => adminStaffFetchers.getStaffList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminStaffDetail = (staffId: string) => {
  return useQuery({
    queryKey: adminStaffKeys.detail(staffId),
    queryFn: () => adminStaffFetchers.getStaffById(staffId),
    enabled: !!staffId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => adminStaffFetchers.createStaff(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
      toast.success('Staff member created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create staff member');
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, input }: { staffId: string; input: UpdateStaffInput }) =>
      adminStaffFetchers.updateStaff(staffId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminStaffKeys.detail(variables.staffId), data);
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
      toast.success('Staff member updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update staff member');
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: string) => adminStaffFetchers.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
      toast.success('Staff member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete staff member');
    },
  });
};

export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, status }: { staffId: string; status: 'active' | 'suspended' }) =>
      adminStaffFetchers.updateStaffStatus(staffId, status),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminStaffKeys.detail(variables.staffId), data);
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
      const statusText = variables.status === 'suspended' ? 'suspended' : 'activated';
      toast.success(`Staff member ${statusText} successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update staff status');
    },
  });
};

/**
 * Get staff collections for admin (pending/received handovers)
 */
export const useStaffCollections = (staffId: string, options?: { days?: number; status?: string }) => {
  return useQuery({
    queryKey: [...adminStaffKeys.detail(staffId), 'collections', options] as const,
    queryFn: () => adminStaffFetchers.getStaffCollections(staffId, options),
    enabled: !!staffId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Mark a date's collection as received by admin
 */
export const useMarkHandoverReceived = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, date }: { staffId: string; date: string }) =>
      adminStaffFetchers.markHandoverReceived(staffId, date),
    onSuccess: (data, variables) => {
      // Invalidate all collections queries for this staff member
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) &&
            key[0] === 'admin-staff' &&
            key[1] === 'detail' &&
            key[2] === variables.staffId &&
            key[3] === 'collections';
        }
      });
      toast.success(`Collection for ${new Date(variables.date).toLocaleDateString('en-IN')} marked as received`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark handover as received');
    },
  });
};

// ============ Staff Leave Hooks ============

export const staffLeaveKeys = {
  all: ['staff-leaves'] as const,
  byDate: (date: string) => [...staffLeaveKeys.all, date] as const,
};

/**
 * Get all staff on leave for a specific date
 */
export const useStaffLeavesByDate = (date?: string) => {
  return useQuery({
    queryKey: staffLeaveKeys.byDate(date || ''),
    queryFn: () => adminStaffFetchers.getLeavesByDate(date!),
    enabled: !!date,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Mark a staff member as on leave
 */
export const useMarkStaffLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, date, reason }: { staffId: string; date: string; reason?: string }) =>
      adminStaffFetchers.markStaffLeave(staffId, date, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: staffLeaveKeys.byDate(variables.date) });
      toast.success(`${data.staffName} marked on leave for ${new Date(variables.date).toLocaleDateString('en-IN')}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark staff on leave');
    },
  });
};

/**
 * Remove leave for a staff member
 */
export const useRemoveStaffLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, date }: { staffId: string; date: string }) =>
      adminStaffFetchers.removeStaffLeave(staffId, date),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: staffLeaveKeys.byDate(variables.date) });
      toast.success('Staff leave removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove leave');
    },
  });
};

