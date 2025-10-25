import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock_jwt_token',
        user: {
          id: 'user_001',
          name: 'Rahul Kumar',
          phone: body.phone,
          role: 'customer',
        },
      },
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock_jwt_token',
        user: {
          id: 'user_new',
          name: body.name,
          phone: body.phone,
          role: 'customer',
        },
      },
    });
  }),
];
