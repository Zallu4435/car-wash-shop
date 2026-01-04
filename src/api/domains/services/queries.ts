import { useQuery } from '@tanstack/react-query';
import { serviceFetchers } from './fetchers';
import type { ServiceFilters } from '@/types/service';

// Query Keys Factory
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters?: ServiceFilters) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
  categories: () => [...serviceKeys.all, 'categories'] as const,
  topReviews: (limit?: number) => [...serviceKeys.all, 'top-reviews', limit] as const,
  landingStats: () => [...serviceKeys.all, 'landing-stats'] as const,
};

// Queries
export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => serviceFetchers.getServices(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useService = (serviceId: string) => {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => serviceFetchers.getServiceById(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useServiceCategories = () => {
  return useQuery({
    queryKey: serviceKeys.categories(),
    queryFn: serviceFetchers.getServiceCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopReviews = (limit: number = 3) => {
  return useQuery({
    queryKey: serviceKeys.topReviews(limit),
    queryFn: () => serviceFetchers.getTopReviews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLandingPageStats = () => {
  return useQuery({
    queryKey: serviceKeys.landingStats(),
    queryFn: serviceFetchers.getLandingPageStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
