export interface Address {
    id: string;
    userId: string;
    label: string; // 'Home', 'Office', etc.
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AddressCreate {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }
  
  export interface AddressInput {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }

  // Extended address type for delivery/order purposes with phone field
  export interface DeliveryAddress {
    id: string;
    userId?: string;
    label: string;
    addressLine1: string;
    addressLine2?: string;
    line1?: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
    landmark?: string;
    isPrimary?: boolean;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  