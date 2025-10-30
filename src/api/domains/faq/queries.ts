import { useQuery } from '@tanstack/react-query';
import { faqFetchers } from './fetchers';

export const faqKeys = {
  all: ['faq'] as const,
  categories: () => [...faqKeys.all, 'categories'] as const,
  faqs: () => [...faqKeys.all, 'faqs'] as const,
  faqsByCategory: (categoryId: string) => [...faqKeys.faqs(), categoryId] as const,
};

export const useFAQCategories = () => {
  return useQuery({
    queryKey: faqKeys.categories(),
    queryFn: faqFetchers.getFAQCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFAQs = () => {
  return useQuery({
    queryKey: faqKeys.faqs(),
    queryFn: faqFetchers.getFAQs,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFAQsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: faqKeys.faqsByCategory(categoryId),
    queryFn: () => faqFetchers.getFAQsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
