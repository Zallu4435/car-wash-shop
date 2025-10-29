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
