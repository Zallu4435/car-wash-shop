import { useQuery } from '@tanstack/react-query';
import { bannerFetchers } from './fetchers';

export const bannerKeys = {
  all: ['banners'] as const,
  active: (position?: string) => [...bannerKeys.all, 'active', position] as const,
};

export const useActiveBanners = (position: string = 'hero') => {
  return useQuery({
    queryKey: bannerKeys.active(position),
    queryFn: () => bannerFetchers.getActiveBanners(position),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

