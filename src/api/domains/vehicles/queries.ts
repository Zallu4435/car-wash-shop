import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleFetchers } from './fetchers';
import type { Vehicle, VehicleInput } from '@/types/vehicle';
import { toast } from 'sonner';

export const vehicleKeys = {
  all: ['vehicles'] as const,
};

export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.all,
    queryFn: vehicleFetchers.getVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VehicleInput) => vehicleFetchers.createVehicle(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add vehicle');
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> }) =>
      vehicleFetchers.updateVehicle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vehicle');
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleFetchers.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vehicle');
    },
  });
};
