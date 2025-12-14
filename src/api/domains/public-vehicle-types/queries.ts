import { useQuery } from '@tanstack/react-query';
import { publicVehicleTypesFetchers } from './fetchers';

const QUERY_KEYS = {
    categories: ['public', 'vehicle-categories'] as const,
    vehicleTypes: ['public', 'vehicle-types'] as const,
    vehicleTypesByCategory: (category: string) =>
        ['public', 'vehicle-types', category] as const,
};

export function usePublicVehicleCategories() {
    return useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: publicVehicleTypesFetchers.getActiveCategories,
        staleTime: 5 * 60 * 1000,
    });
}

export function usePublicVehicleTypes(category?: string) {
    return useQuery({
        queryKey: category
            ? QUERY_KEYS.vehicleTypesByCategory(category)
            : QUERY_KEYS.vehicleTypes,
        queryFn: () => publicVehicleTypesFetchers.getActiveVehicleTypes(category),
        staleTime: 5 * 60 * 1000,
    });
}
