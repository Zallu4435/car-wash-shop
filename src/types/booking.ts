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
  bookingNumber: string;
  userId?: string;
  serviceId: string;
  serviceName: string;
  vehicleId?: string;
  scheduledAt?: string;
  scheduledDate: string;
  scheduledTime: string;
  addressId?: string;
  address: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount?: number;
  amount: number;
  advanceAmount?: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  addOns?: AddOn[];
  vehicleDetails: {
    brand: string;
    model: string;
    number: string;
    type: string;
  };
  assignedStaff?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt?: string;
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
