import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminVehiclesFetchers } from './fetchers';
import type { CreateVehicleBrandInput, CreateVehicleModelInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminVehiclesKeys = {
  all: ['admin-vehicles'] as const,
  brands: () => [...adminVehiclesKeys.all, 'brands'] as const,
  models: () => [...adminVehiclesKeys.all, 'models'] as const,
};

// Brands
export const useVehicleBrands = () => {
  return useQuery({
    queryKey: adminVehiclesKeys.brands(),
    queryFn: adminVehiclesFetchers.getVehicleBrands,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateVehicleBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleBrandInput) => adminVehiclesFetchers.createVehicleBrand(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.brands() });
      toast.success('Vehicle brand created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create vehicle brand');
    },
  });
};

export const useUpdateVehicleBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, input }: { brandId: string; input: Partial<CreateVehicleBrandInput> }) =>
      adminVehiclesFetchers.updateVehicleBrand(brandId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.brands() });
      toast.success('Vehicle brand updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vehicle brand');
    },
  });
};

export const useDeleteVehicleBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: string) => adminVehiclesFetchers.deleteVehicleBrand(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.brands() });
      toast.success('Vehicle brand deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vehicle brand');
    },
  });
};

// Models
export const useVehicleModels = () => {
  return useQuery({
    queryKey: adminVehiclesKeys.models(),
    queryFn: adminVehiclesFetchers.getVehicleModels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateVehicleModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleModelInput) => adminVehiclesFetchers.createVehicleModel(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.models() });
      toast.success('Vehicle model created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create vehicle model');
    },
  });
};

export const useUpdateVehicleModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, input }: { modelId: string; input: Partial<CreateVehicleModelInput> }) =>
      adminVehiclesFetchers.updateVehicleModel(modelId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.models() });
      toast.success('Vehicle model updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vehicle model');
    },
  });
};

export const useDeleteVehicleModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modelId: string) => adminVehiclesFetchers.deleteVehicleModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminVehiclesKeys.models() });
      toast.success('Vehicle model deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vehicle model');
    },
  });
};
