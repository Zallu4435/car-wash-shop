import { http, HttpResponse } from 'msw';

export const orderHandlers = [
  http.get('/api/orders', () => {
    return HttpResponse.json({
      success: true,
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    });
  }),
];
