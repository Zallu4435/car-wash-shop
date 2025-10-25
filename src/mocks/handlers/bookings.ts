import { http, HttpResponse } from 'msw';

export const bookingHandlers = [
  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        id: 'booking_' + Math.random().toString(36).substr(2, 9),
        ...body,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/bookings', () => {
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
