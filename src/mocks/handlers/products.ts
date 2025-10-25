import { http, HttpResponse } from 'msw';

const productsData = [
  {
    id: 'prod_001',
    name: 'Car Shampoo',
    categoryId: 'cat_clean',
    category: {
      id: 'cat_clean',
      name: 'Cleaning Products',
      description: 'Professional cleaning products',
      active: true,
      order: 1,
    },
    description: 'Premium car shampoo for gentle cleaning',
    price: 299,
    stock: 50,
    images: ['/images/products/shampoo.jpg'],
    rating: 4.5,
    reviewCount: 42,
    active: true,
    createdAt: '2025-01-10T00:00:00Z',
  },
];

export const productHandlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: productsData,
      meta: {
        total: productsData.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  }),
];
