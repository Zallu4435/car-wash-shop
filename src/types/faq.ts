export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQWithCategory extends FAQ {
  category: FAQCategory;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  categoryId: string;
  order?: number;
}

export interface UpdateFAQInput {
  question?: string;
  answer?: string;
  categoryId?: string;
  order?: number;
  isActive?: boolean;
}
