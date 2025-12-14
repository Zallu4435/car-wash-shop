import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    adminVehicleTypesFetchers,
    type VehicleCategoryInput,
    type VehicleTypeInput,
} from './fetchers';

const QUERY_KEYS = {
    categories: ['admin', 'vehicle-categories'] as const,
    categoryWithTypes: (id: string) => ['admin', 'vehicle-categories', id] as const,
    vehicleTypes: ['admin', 'vehicle-types'] as const,
};

// Categories
export function useAdminVehicleCategories() {
    return useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: adminVehicleTypesFetchers.getCategories,
    });
}

export function useAdminCategoryWithTypes(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.categoryWithTypes(id),
        queryFn: () => adminVehicleTypesFetchers.getCategoryWithTypes(id),
        enabled: !!id,
    });
}

export function useCreateVehicleCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VehicleCategoryInput) =>
            adminVehicleTypesFetchers.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-categories'] });
        },
    });
}

export function useUpdateVehicleCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<VehicleCategoryInput> }) =>
            adminVehicleTypesFetchers.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-categories'] });
        },
    });
}

export function useDeleteVehicleCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminVehicleTypesFetchers.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicleTypes });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-categories'] });
        },
    });
}

// Types
export function useAdminVehicleTypes(category?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.vehicleTypes, category],
        queryFn: () => adminVehicleTypesFetchers.getVehicleTypes(category),
    });
}

export function useCreateVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VehicleTypeInput) =>
            adminVehicleTypesFetchers.createVehicleType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicleTypes });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-types'] });
        },
    });
}

export function useUpdateVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<VehicleTypeInput> }) =>
            adminVehicleTypesFetchers.updateVehicleType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicleTypes });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-types'] });
        },
    });
}

export function useDeleteVehicleType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminVehicleTypesFetchers.deleteVehicleType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicleTypes });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            queryClient.invalidateQueries({ queryKey: ['public', 'vehicle-types'] });
        },
    });
}
