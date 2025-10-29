import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartFetchers } from './fetchers';
import type { AddToCartInput, UpdateCartItemInput } from '@/types/cart';
import { toast } from 'sonner';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartFetchers.getCart,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddToCartInput) => cartFetchers.addToCart(input),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
      toast.success('Item added to cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: UpdateCartItemInput }) =>
      cartFetchers.updateCartItem(itemId, input),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
      toast.success('Cart updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartFetchers.removeFromCart(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(), data);
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove item');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartFetchers.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart cleared');
    },
  });
};
