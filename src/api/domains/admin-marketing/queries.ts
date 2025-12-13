import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMarketingFetchers } from './fetchers';
import { toast } from 'sonner';

export const adminMarketingKeys = {
  all: ['admin-marketing'] as const,
  posters: () => [...adminMarketingKeys.all, 'posters'] as const,
  postersList: (filters?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => [...adminMarketingKeys.posters(), 'list', filters] as const,
  posterDetail: (id: string) => [...adminMarketingKeys.posters(), 'detail', id] as const,
};

// Posters
export const useAdminPosterList = (filters?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) => {
  // Convert pageSize to limit for the API
  const apiFilters = filters ? {
    ...filters,
    limit: filters.pageSize,
    pageSize: undefined,
  } : undefined;

  return useQuery({
    queryKey: adminMarketingKeys.postersList(filters),
    queryFn: () => adminMarketingFetchers.getPosterList(apiFilters as any),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminPosterDetail = (posterId: string) => {
  return useQuery({
    queryKey: adminMarketingKeys.posterDetail(posterId),
    queryFn: () => adminMarketingFetchers.getPosterById(posterId),
    enabled: !!posterId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreatePoster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => adminMarketingFetchers.createPoster(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.posters() });
      toast.success('Poster created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create poster');
    },
  });
};

export const useUpdatePoster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ posterId, input }: { posterId: string; input: any }) =>
      adminMarketingFetchers.updatePoster(posterId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminMarketingKeys.posterDetail(variables.posterId), data);
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.posters() });
      toast.success('Poster updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update poster');
    },
  });
};

export const useDeletePoster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (posterId: string) => adminMarketingFetchers.deletePoster(posterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.posters() });
      toast.success('Poster deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete poster');
    },
  });
};

