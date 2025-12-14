import { useQuery } from '@tanstack/react-query';
import { publicContactsFetchers, PublicPlatformContact, PublicCompanyDetails } from './fetchers';

export function usePublicPlatformContact() {
    return useQuery({
        queryKey: ['public', 'platform-contact'] as const,
        queryFn: publicContactsFetchers.getPlatformContact,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
}

export function usePublicCompanyDetails() {
    return useQuery({
        queryKey: ['public', 'company-details'] as const,
        queryFn: publicContactsFetchers.getCompanyDetails,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
}

export type { PublicPlatformContact, PublicCompanyDetails };
