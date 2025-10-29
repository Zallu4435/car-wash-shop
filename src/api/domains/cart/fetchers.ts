import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Cart, AddToCartInput, UpdateCartItemInput } from '@/types/cart';
import { CustomerRoutes } from '@/lib/constants/routes';

export const cartFetchers = {
  async getCart(): Promise<Cart> {
    const { data } = await apiClient.get<ApiResponse<Cart>>(CustomerRoutes.CART);
    return data.data!;
  },

  async addToCart(input: AddToCartInput): Promise<Cart> {
    const { data } = await apiClient.post<ApiResponse<Cart>>(CustomerRoutes.CART, input);
    return data.data!;
  },

  async updateCartItem(itemId: string, input: UpdateCartItemInput): Promise<Cart> {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(
      `${CustomerRoutes.CART}/${itemId}`,
      input
    );
    return data.data!;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`${CustomerRoutes.CART}/${itemId}`);
    return data.data!;
  },

  async clearCart(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.CART}/clear`
    );
    return data.data!;
  },
};
