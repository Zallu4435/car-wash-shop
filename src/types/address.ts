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
  
  export interface AddressInput {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }
  