export interface Vehicle {
  id: string;
  userId: string;
  type: 'car' | 'bike';
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  type: 'car' | 'bike';
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
}
