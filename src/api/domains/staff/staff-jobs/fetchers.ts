import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  StaffJob,
  StaffJobDetail,
  StaffJobFilters,
  UpdateJobStatusInput,
} from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffJobsFetchers = {
  async getJobs(filters?: StaffJobFilters): Promise<PaginatedResponse<StaffJob>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<StaffJob>>>(
      StaffRoutes.JOBS,
      { params: filters }
    );
    return data.data!;
  },

  async getJobById(jobId: string): Promise<StaffJobDetail> {
    const { data } = await apiClient.get<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId)
    );
    return data.data!;
  },

  async updateJobStatus(
    jobId: string,
    input: UpdateJobStatusInput
  ): Promise<StaffJobDetail> {
    const { data} = await apiClient.patch<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId),
      input
    );
    return data.data!;
  },

  async getWorkHistory(filters?: StaffJobFilters): Promise<StaffJob[]> {
    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.HISTORY,
      { params: filters }
    );
    return data.data!;
  },
};
