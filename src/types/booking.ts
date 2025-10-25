import { Address } from './shared';
import { Service, AddOn } from './service';
import { Vehicle } from './vehicle';

export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentType = 'full' | 'advance';
export type PaymentMethod = 'online' | 'cod';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  service: Service;
  addOns: AddOn[];
  vehicleId: string;
  vehicle: Vehicle;
  scheduledTime: string;
  address: Address;
  pricing: {
    basePrice: number;
    addOnsTotal: number;
    subtotal: number;
    couponCode?: string;
    discount: number;
    total: number;
  };
  payment: {
    type: PaymentType;
    method: PaymentMethod;
    advanceAmount?: number;
    balanceAmount?: number;
    advanceStatus: 'pending' | 'paid';
    balanceStatus: 'pending' | 'paid';
    transactionId?: string;
  };
  status: BookingStatus;
  staffId?: string;
  staffName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
