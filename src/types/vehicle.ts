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

export interface VehicleBrand {
  id: string;
  name: string;
  logo: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  brandId: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'luxury' | 'bike';
}
