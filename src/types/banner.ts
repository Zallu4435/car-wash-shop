export type BannerPosition = 'hero' | 'top' | 'middle' | 'bottom' | 'sidebar' | 'popup';
export type BannerType = 'carousel' | 'static' | 'video' | 'animated';
export type UserType = 'all' | 'new' | 'returning';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  position: BannerPosition;
  type: BannerType;
  link?: string;
  cta?: {
    text: string;
    link: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
  };
  targeting: {
    pages: string[];
    userType?: UserType;
  };
  priority: number;
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
}
