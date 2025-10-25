import { http, HttpResponse } from 'msw';
import servicesData from '../data/services.json';

export const serviceHandlers = [
  http.get('/api/services', () => {
    return HttpResponse.json({
      success: true,
      data: servicesData,
      meta: {
        total: servicesData.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  }),

  http.get('/api/services/:id', ({ params }) => {
    const service = servicesData.find((s) => s.id === params.id);
    if (!service) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Service not found',
          },
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: service,
    });
  }),
];
