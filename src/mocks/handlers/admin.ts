import { http, HttpResponse } from 'msw';

export const adminHandlers = [
  http.get('/api/admin/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalBookings: 247,
        activeServices: 12,
        totalRevenue: 125000,
        activeCustomers: 458,
      },
    });
  }),
];
