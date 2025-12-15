import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAddonsFetchers, AddonListParams, CreateAddonInput, UpdateAddonInput } from './fetchers';
import { toast } from 'sonner';

export const adminAddonsKeys = {
    all: ['admin-addons'] as const,
    list: (params: AddonListParams) => [...adminAddonsKeys.all, 'list', params] as const,
    detail: (id: string) => [...adminAddonsKeys.all, 'detail', id] as const,
};

export const useAdminAddons = (params: AddonListParams = {}) => {
    return useQuery({
        queryKey: adminAddonsKeys.list(params),
        queryFn: () => adminAddonsFetchers.getAddons(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useAdminAddonById = (id: string) => {
    return useQuery({
        queryKey: adminAddonsKeys.detail(id),
        queryFn: () => adminAddonsFetchers.getAddonById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateAddonInput) => adminAddonsFetchers.createAddon(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminAddonsKeys.all });
            toast.success('Add-on created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create add-on');
        },
    });
};

export const useUpdateAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateAddonInput }) =>
            adminAddonsFetchers.updateAddon(id, input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminAddonsKeys.all });
            queryClient.invalidateQueries({ queryKey: adminAddonsKeys.detail(variables.id) });
            toast.success('Add-on updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update add-on');
        },
    });
};

export const useDeleteAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminAddonsFetchers.deleteAddon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminAddonsKeys.all });
            toast.success('Add-on deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete add-on');
        },
    });
};
