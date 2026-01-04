import { BookingStatus, PaymentStatus } from '@/lib/constants/status';

export interface BookingInput {
  serviceId: string;
  serviceName?: string;
  vehicleId: string;
  slotId: string; // ID of the selected time slot
  addressId: string; // Backend will fetch full address from this
  addOns?: string[];
  paymentType: 'full' | 'advance';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BookingAddress {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  phone?: string;
  fullAddress?: string; // Computed field for display
}

export interface Booking {
  id: string;
  bookingNumber?: string; // Deprecated - use id instead
  userId?: string;
  serviceId: string;
  serviceName: string;
  vehicleId?: string;
  slotId?: string;
  scheduledAt?: string;
  scheduledDate: string;
  scheduledTime: string;
  address: BookingAddress; // Now an object, not a string
  status: BookingStatus;
  totalAmount?: number;
  amount: number;
  advanceAmount?: number;
  paymentStatus: PaymentStatus;
  addOns?: AddOn[];
  vehicleDetails: {
    category: 'car' | 'bike';
    bodyType: string;
  };
  assignedStaff?: string;
  completedAt?: string;
  feedback?: BookingFeedback;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingFeedback {
  rating: number;
  comment?: string;
  submittedAt?: string;
}

export interface BookingFeedbackInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface AddOn {
  id?: string;
  addonId?: string;
  name: string;
  price: number;
  duration?: number;
}

export interface BookingPreview {
  servicePrice: number;
  addOnsTotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  advanceAmount?: number;
}

export interface TimeSlot {
  id: string;
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
