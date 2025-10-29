import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Cart, AddToCartInput, UpdateCartItemInput } from '@/types/cart';
import { CustomerRoutes } from '@/lib/constants/routes';
import { mockCartItems } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// In-memory cart store for mock mode
let mockCart: any[] = [...mockCartItems];

export const cartFetchers = {
  async getCart(): Promise<Cart> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        items: mockCartItems as any,
        subtotal,
        total: subtotal,
        itemCount: mockCartItems.reduce((sum, item) => sum + item.quantity, 0),
      } as any;
    }
    
    const { data } = await apiClient.get<ApiResponse<Cart>>(CustomerRoutes.CART);
    return data.data!;
  },

  async addToCart(input: AddToCartInput): Promise<Cart> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate adding to cart by returning updated cart
      const newItem = {
        id: `cart_${Date.now()}`,
        userId: 'user_001',
        type: input.type,
        productId: input.type === 'product' ? input.itemId : undefined,
        serviceId: input.type === 'service' ? input.itemId : undefined,
        quantity: input.quantity || 1,
        price: 299, // Mock price
        createdAt: new Date().toISOString(),
      };
      const updatedItems = [...mockCartItems, newItem as any];
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        items: updatedItems as any,
        subtotal,
        total: subtotal,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      } as any;
    }
    
    const { data } = await apiClient.post<ApiResponse<Cart>>(CustomerRoutes.CART, input);
    return data.data!;
  },

  async updateCartItem(itemId: string, input: UpdateCartItemInput): Promise<Cart> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedItems = mockCartItems.map(item => 
        item.id === itemId ? { ...item, quantity: input.quantity || item.quantity } : item
      );
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        items: updatedItems as any,
        subtotal,
        total: subtotal,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      } as any;
    }
    
    const { data } = await apiClient.patch<ApiResponse<Cart>>(
      `${CustomerRoutes.CART}/${itemId}`,
      input
    );
    return data.data!;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedItems = mockCartItems.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        items: updatedItems as any,
        subtotal,
        total: subtotal,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      } as any;
    }
    
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`${CustomerRoutes.CART}/${itemId}`);
    return data.data!;
  },

  async clearCart(): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { message: 'Cart cleared successfully' };
    }
    
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.CART}/clear`
    );
    return data.data!;
  },
};
