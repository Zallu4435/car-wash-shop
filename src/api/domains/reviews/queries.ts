import { useQuery } from '@tanstack/react-query';
import { reviewFetchers, type ServiceReviewsResponse } from './fetchers';

export const reviewKeys = {
  all: ['reviews'] as const,
  byService: (serviceId: string) => ['reviews', 'service', serviceId] as const,
};

export const useServiceReviews = (serviceId: string) => {
  return useQuery<ServiceReviewsResponse>({
    queryKey: reviewKeys.byService(serviceId),
    queryFn: () => reviewFetchers.getReviewsByServiceId(serviceId),
    enabled: !!serviceId,
  });
};
