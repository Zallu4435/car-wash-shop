export interface Poster {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaText: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface PosterFilters {
  location?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}
