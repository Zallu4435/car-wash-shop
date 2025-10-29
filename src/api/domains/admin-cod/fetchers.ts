import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type { CODTransaction, CODReport } from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminCODFetchers = {
  async getCODTransactions(filters?: { status?: string; staffId?: string }): Promise<CODTransaction[]> {
    const { data } = await apiClient.get<ApiResponse<CODTransaction[]>>(
      AdminRoutes.COD,
      { params: filters }
    );
    return data.data!;
  },

  async getCODReport(fromDate?: string, toDate?: string): Promise<CODReport> {
    const { data } = await apiClient.get<ApiResponse<CODReport>>(
      AdminRoutes.COD_REPORTS,
      { params: { fromDate, toDate } }
    );
    return data.data!;
  },

  async verifyCODTransaction(transactionId: string): Promise<CODTransaction> {
    const { data } = await apiClient.post<ApiResponse<CODTransaction>>(
      `${AdminRoutes.COD}/${transactionId}/verify`
    );
    return data.data!;
  },
};
