export interface Vehicle {
  id: string;
  userId: string;
  category: 'car' | 'bike';
  bodyType:
  | 'sedan'
  | 'suv'
  | 'hatchback'
  | 'luxury'
  | 'super-bike'
  | 'sports-bike'
  | 'cruiser'
  | 'scooty'
  | 'scooter'
  | 'motorcycle';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  // Legacy field for backward compatibility (computed from category/bodyType)
  type?: 'car' | 'bike' | 'suv' | 'sedan' | 'hatchback';
}

export interface VehicleInput {
  category: 'car' | 'bike';
  bodyType:
  | 'sedan'
  | 'suv'
  | 'hatchback'
  | 'luxury'
  | 'super-bike'
  | 'sports-bike'
  | 'cruiser'
  | 'scooty'
  | 'scooter'
  | 'motorcycle';
}
