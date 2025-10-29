export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  position: string;
  pages: string[];
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  startDate: string;
  endDate: string;
  active: boolean;
  order: number;
}

export interface BannerFilters {
  position?: string;
  page?: string;
  active?: boolean;
}
