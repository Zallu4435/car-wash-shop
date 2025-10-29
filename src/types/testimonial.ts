export interface Testimonial {
  id: string;
  userId?: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  serviceId?: string;
  serviceName?: string;
  createdAt: string;
  featured?: boolean;
}

export interface TestimonialFilters {
  featured?: boolean;
  minRating?: number;
  serviceId?: string;
  page?: number;
  limit?: number;
}
