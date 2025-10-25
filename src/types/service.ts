export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  active: boolean;
  order: number;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number;
  inclusions: string[];
  addOns: AddOn[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  active: boolean;
  createdAt: string;
}
