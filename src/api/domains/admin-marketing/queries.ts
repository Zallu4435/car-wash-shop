import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMarketingFetchers } from './fetchers';
import type { CreateBannerInput, UpdateBannerInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminMarketingKeys = {
  all: ['admin-marketing'] as const,
  banners: () => [...adminMarketingKeys.all, 'banners'] as const,
  bannersList: () => [...adminMarketingKeys.banners(), 'list'] as const,
  bannerDetail: (id: string) => [...adminMarketingKeys.banners(), 'detail', id] as const,
};

// Banners
export const useAdminBannerList = () => {
  return useQuery({
    queryKey: adminMarketingKeys.bannersList(),
    queryFn: adminMarketingFetchers.getBannerList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminBannerDetail = (bannerId: string) => {
  return useQuery({
    queryKey: adminMarketingKeys.bannerDetail(bannerId),
    queryFn: () => adminMarketingFetchers.getBannerById(bannerId),
    enabled: !!bannerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBannerInput) => adminMarketingFetchers.createBanner(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.banners() });
      toast.success('Banner created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create banner');
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bannerId, input }: { bannerId: string; input: UpdateBannerInput }) =>
      adminMarketingFetchers.updateBanner(bannerId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminMarketingKeys.bannerDetail(variables.bannerId), data);
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.banners() });
      toast.success('Banner updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update banner');
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bannerId: string) => adminMarketingFetchers.deleteBanner(bannerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMarketingKeys.banners() });
      toast.success('Banner deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete banner');
    },
  });
};

// Posters
export const useAdminPosterList = () => {
  return useQuery({
    queryKey: [...adminMarketingKeys.all, 'posters'],
    queryFn: adminMarketingFetchers.getPosterList,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeletePoster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (posterId: string) => adminMarketingFetchers.deletePoster(posterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminMarketingKeys.all, 'posters'] });
      toast.success('Poster deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete poster');
    },
  });
};

// Campaigns
export const useAdminCampaignList = () => {
  return useQuery({
    queryKey: [...adminMarketingKeys.all, 'campaigns'],
    queryFn: adminMarketingFetchers.getCampaignList,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: string) => adminMarketingFetchers.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminMarketingKeys.all, 'campaigns'] });
      toast.success('Campaign deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete campaign');
    },
  });
};
