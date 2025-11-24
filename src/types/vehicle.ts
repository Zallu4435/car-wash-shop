export interface Vehicle {
  id: string;
  userId: string;
  category: 'car' | 'bike';
  bodyType: 'sedan' | 'suv' | 'hatchback' | 'scooter' | 'motorcycle';
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  // Legacy field for backward compatibility (computed from category/bodyType)
  type?: 'car' | 'bike' | 'suv' | 'sedan' | 'hatchback';
}

export interface VehicleInput {
  category: 'car' | 'bike';
  bodyType: 'sedan' | 'suv' | 'hatchback' | 'scooter' | 'motorcycle';
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
