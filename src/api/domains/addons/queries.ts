import { useQuery } from '@tanstack/react-query';
import { addonsFetchers } from './fetchers';

export const addonsKeys = {
    all: ['addons'] as const,
    active: (category?: string) => [...addonsKeys.all, 'active', category] as const,
};

/**
 * Hook to fetch active add-ons for customers
 * @param category - Optional filter by vehicle category ('car' | 'bike')
 */
export const useActiveAddons = (category?: string) => {
    return useQuery({
        queryKey: addonsKeys.active(category),
        queryFn: () => addonsFetchers.getActiveAddons(category),
        staleTime: 5 * 60 * 1000, // 5 minutes - add-ons don't change often
    });
};
