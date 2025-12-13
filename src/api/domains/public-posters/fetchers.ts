import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { Poster } from '@/types/poster';

const PUBLIC_POSTERS_URL = '/posters';

export const publicPosterFetchers = {
    async getActivePosters(): Promise<Poster[]> {
        const { data } = await apiClient.get<ApiResponse<Poster[]>>(
            PUBLIC_POSTERS_URL
        );
        return data.data || [];
    },
};
