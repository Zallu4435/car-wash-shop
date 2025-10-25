export interface Brand {
  id: string;
  name: string;
  logo?: string;
  popular: boolean;
  createdAt: string;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  year: number;
  type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'truck';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  brandId: string;
  modelId: string;
  brand: Brand;
  model: Model;
  year: number;
  plateNumber?: string;
  color?: string;
  createdAt: string;
}
