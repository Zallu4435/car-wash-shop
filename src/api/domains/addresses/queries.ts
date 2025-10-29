import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressFetchers } from './fetchers';
import type { AddressInput } from '@/types/address';
import { toast } from 'sonner';

export const addressKeys = {
  all: ['addresses'] as const,
};

export const useAddresses = () => {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: addressFetchers.getAddresses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddressInput) => addressFetchers.createAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add address');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) =>
      addressFetchers.updateAddress(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update address');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressFetchers.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete address');
    },
  });
};

export const useSetPrimaryAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressFetchers.setPrimaryAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Primary address updated');
    },
  });
};
