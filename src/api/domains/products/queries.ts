import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productFetchers } from './fetchers';
import type { ProductFilters } from '@/types/product';
import { toast } from 'sonner';

// Query Keys Factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

// Queries
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productFetchers.getProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productFetchers.getProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productFetchers.getProductCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - Categories rarely change
  });
};

// Mutations
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productFetchers.addToFavorites(productId),
    onSuccess: (data, productId) => {
      // Invalidate product detail to refetch updated favorite status
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success('Added to favorites');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to favorites');
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      productFetchers.removeFromFavorites(productId),
    onSuccess: (data, productId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success('Removed from favorites');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from favorites');
    },
  });
};
