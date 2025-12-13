import { useQuery } from '@tanstack/react-query';
import { publicPosterFetchers } from './fetchers';

export const publicPosterKeys = {
    all: ['public-posters'] as const,
    active: () => [...publicPosterKeys.all, 'active'] as const,
};

export const useActivePosters = () => {
    return useQuery({
        queryKey: publicPosterKeys.active(),
        queryFn: () => publicPosterFetchers.getActivePosters(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
