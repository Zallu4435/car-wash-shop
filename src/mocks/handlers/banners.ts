import { http, HttpResponse } from 'msw';
import bannersData from '../data/banners.json';

export const bannerHandlers = [
  http.get('/api/banners', () => {
    return HttpResponse.json({
      success: true,
      data: bannersData,
    });
  }),

  http.get('/api/banners/:id', ({ params }) => {
    const banner = bannersData.find((b) => b.id === params.id);
    if (!banner) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Banner not found',
          },
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: banner,
    });
  }),
];
