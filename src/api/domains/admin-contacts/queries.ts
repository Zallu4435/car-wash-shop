import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContactsFetchers, PlatformContact, CompanyDetails } from './fetchers';

const QUERY_KEYS = {
    platformContact: ['admin', 'platform-contact'] as const,
    companyDetails: ['admin', 'company-details'] as const,
};

// Platform Contact
export function usePlatformContact() {
    return useQuery({
        queryKey: QUERY_KEYS.platformContact,
        queryFn: adminContactsFetchers.getPlatformContact,
    });
}

export function useUpdatePlatformContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<PlatformContact>) => adminContactsFetchers.updatePlatformContact(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.platformContact });
            // Also invalidate public query if it exists
            queryClient.invalidateQueries({ queryKey: ['public', 'platform-contact'] });
        },
    });
}

// Company Details
export function useCompanyDetails() {
    return useQuery({
        queryKey: QUERY_KEYS.companyDetails,
        queryFn: adminContactsFetchers.getCompanyDetails,
    });
}

export function useUpdateCompanyDetails() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CompanyDetails>) => adminContactsFetchers.updateCompanyDetails(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.companyDetails });
        },
    });
}
