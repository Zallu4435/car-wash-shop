export interface Vehicle {
  id: string;
  userId: string;
  type: 'car' | 'bike' | 'suv' | 'sedan' | 'hatchback';
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  type: 'car' | 'bike' | 'suv' | 'sedan' | 'hatchback';
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
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
