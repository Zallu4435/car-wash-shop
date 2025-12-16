// Reviews/rating feature is disabled. These hooks are kept as no-ops
// to avoid breaking existing imports.

export const reviewKeys = {
  all: ['reviews'] as const,
  byOrder: (_orderId: string) => ['reviews', 'order', _orderId] as const,
  byBooking: (_bookingId: string) => ['reviews', 'booking', _bookingId] as const,
  byProduct: (_productId: string) => ['reviews', 'product', _productId] as const,
  byService: (_serviceId: string) => ['reviews', 'service', _serviceId] as const,
};

export const useReviewByOrder = (_orderId: string) => ({
  data: null,
  isLoading: false,
});

export const useReviewByBooking = (_bookingId: string) => ({
  data: null,
  isLoading: false,
});

export const useReviewsByProduct = (_productId: string) => ({
  data: [] as any[],
  isLoading: false,
});

export const useReviewsByService = (_serviceId: string) => ({
  data: [] as any[],
  isLoading: false,
});

export const useSubmitReview = () => ({
  mutate: () => {},
  isLoading: false,
});

export const useUpdateReview = () => ({
  mutate: () => {},
  isLoading: false,
});

export const useDeleteReview = () => ({
  mutate: () => {},
  isLoading: false,
});
