import { http, HttpResponse } from 'msw';

export const staffHandlers = [
  http.get('/api/staff', () => {
    return HttpResponse.json({
      success: true,
      data: [],
    });
  }),
];
