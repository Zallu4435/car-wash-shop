export interface Poster {
  id: string;
  title: string;
  description?: string;
  image: string;
  endDate: string;
  headingColor?: string;
  descriptionColor?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  displayOrder?: number;
  // Legacy fields for compatibility
  imageUrl?: string;
  link?: string;
  ctaText?: string;
  location?: string;
  startDate?: string;
  status?: 'active' | 'inactive';
}

export interface PosterFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
