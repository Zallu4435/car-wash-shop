import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartFetchers } from './fetchers';
import type { AddToCartInput, UpdateCartItemInput, Cart } from '@/types/cart';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

export const useCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: cartFetchers.getCart,
    enabled: isAuthenticated, // Only fetch when user is authenticated (reactive)
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: true, // Always refetch when component mounts (helps after login)
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
    // Optimistic update - update UI immediately before server responds
    onMutate: async ({ itemId, input }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(cartKeys.detail()) as Cart | undefined;

      // Optimistically update the cart
      if (previousCart && input.quantity !== undefined) {
        const updatedItems = previousCart.items.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity: input.quantity! };
          }
          return item;
        });

        // Recalculate totals
        const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        queryClient.setQueryData(cartKeys.detail(), {
          ...previousCart,
          items: updatedItems,
          subtotal,
          total: subtotal,
          itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0),
        });
      }

      // Return context with previous cart for rollback
      return { previousCart };
    },
    // onSuccess: No action needed - optimistic update already applied
    // Server response is only used for rollback in onError
    onError: (error: any, _variables, context) => {
      // Rollback to previous cart on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
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
