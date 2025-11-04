import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Cart, AddToCartInput, UpdateCartItemInput } from '@/types/cart';

const CART_API = '/cart';

export const cartFetchers = {
  async getCart(): Promise<Cart> {
    const { data } = await apiClient.get<ApiResponse<Cart>>(CART_API);
    return data.data!;
  },

  async addToCart(input: AddToCartInput): Promise<Cart> {
    const { data } = await apiClient.post<ApiResponse<Cart>>(CART_API, input);
    return data.data!;
  },

  async updateCartItem(itemId: string, input: UpdateCartItemInput): Promise<Cart> {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(
      `${CART_API}/${itemId}`,
      input
    );
    return data.data!;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`${CART_API}/${itemId}`);
    return data.data!;
  },

  async clearCart(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CART_API}/clear`
    );
    return data.data!;
  },
};
