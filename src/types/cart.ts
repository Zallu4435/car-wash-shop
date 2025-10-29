export interface CartItem {
    id: string;
    userId: string;
    type: 'product' | 'service';
    productId?: string;
    serviceId?: string;
    quantity: number;
    price: number;
    addOns?: AddOn[];
    product?: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    service?: {
      id: string;
      name: string;
      duration: string;
      price: number;
    };
    createdAt: string;
  }
  
  export interface AddOn {
    id: string;
    name: string;
    price: number;
  }
  
  export interface Cart {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
  }
  
  export interface AddToCartInput {
    type: 'product' | 'service';
    itemId: string;
    quantity?: number;
    addOns?: string[];
  }
  
  export interface UpdateCartItemInput {
    quantity?: number;
    addOns?: string[];
  }
  