import { http, HttpResponse } from 'msw';
import couponsData from '../data/coupons.json';

export const couponHandlers = [
  http.get('/api/coupons', () => {
    return HttpResponse.json({
      success: true,
      data: couponsData,
    });
  }),

  http.post('/api/coupons/validate', async ({ request }) => {
    const body = (await request.json()) as { code: string };
    const coupon = couponsData.find((c) => c.code === body.code && c.active);

    if (!coupon) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_COUPON',
            message: 'Invalid or expired coupon code',
          },
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: coupon,
    });
  }),
];
