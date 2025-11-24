import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Banner } from '@/types/banner';

// Map backend banner to frontend Banner format
function mapBackendBannerToBanner(b: any): Banner {
  return {
    id: b._id || b.id,
    title: b.title,
    subtitle: b.subtitle || '',
    position: b.position || 'hero',
    pages: Array.isArray(b.pages) ? b.pages : (b.pages ? [b.pages] : ['home']),
    imageUrl: b.imageUrl || b.image || '',
    ctaText: b.ctaText || 'Learn More',
    ctaLink: b.ctaLink || b.link || '',
    startDate: b.startDate ? new Date(b.startDate).toISOString() : '',
    endDate: b.endDate ? new Date(b.endDate).toISOString() : '',
    active: b.active !== false,
    order: b.order || 0,
  };
}

export const bannerFetchers = {
  async getActiveBanners(position: string = 'hero'): Promise<Banner[]> {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>(
      '/admin/banners/public',
      { params: { position } }
    );
    return (data.data || []).map(mapBackendBannerToBanner);
  },
};

