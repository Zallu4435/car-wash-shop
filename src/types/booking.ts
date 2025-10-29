export interface BookingInput {
  serviceId: string;
  vehicleId: string;
  scheduledAt: string; // ISO date-time
  addressId: string;
  addOns?: string[];
  couponCode?: string;
  paymentType: 'full' | 'advance';
  notes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  vehicleId: string;
  scheduledAt: string;
  addressId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  advanceAmount?: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  addOns?: AddOn[];
  service?: {
    id: string;
    name: string;
    duration: string;
  };
  vehicle?: {
    id: string;
    type: string;
    model: string;
    number: string;
  };
  address?: {
    id: string;
    line1: string;
    line2?: string;
    city: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface BookingPreview {
  servicePrice: number;
  addOnsTotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  advanceAmount?: number;
  couponApplied?: {
    code: string;
    discount: number;
  };
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  slots: TimeSlot[];
}

export interface BookingFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
