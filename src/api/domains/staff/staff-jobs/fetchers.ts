import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { StaffJob, StaffJobDetail, StaffJobFilters, UpdateJobStatusInput } from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';
import { BOOKING_STATUS } from '@/lib/constants/status';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockJobs: StaffJob[] = [
  { id: 'JOB001', service: 'Premium Car Wash', customer: 'Rajesh Kumar', time: '10:00 AM', datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), location: 'Koramangala', status: BOOKING_STATUS.CONFIRMED, amount: 599 },
  { id: 'JOB002', service: 'Interior Detailing', customer: 'Priya Sharma', time: '12:30 PM', datetime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(), location: 'Indiranagar', status: BOOKING_STATUS.CONFIRMED, amount: 899 },
  { id: 'JOB003', service: 'Bike Wash', customer: 'Amit Patel', time: '2:00 PM', datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), location: 'HSR Layout', status: BOOKING_STATUS.PENDING, amount: 199 },
  { id: 'JOB004', service: 'Full Service', customer: 'Sneha Reddy', time: '4:30 PM', datetime: new Date(Date.now() + 8.5 * 60 * 60 * 1000).toISOString(), location: 'Whitefield', status: BOOKING_STATUS.IN_PROGRESS, amount: 1299 },
  { id: 'JOB005', service: 'Express Wash', customer: 'Vikram Singh', time: '5:00 PM', datetime: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(), location: 'BTM Layout', status: BOOKING_STATUS.CONFIRMED, amount: 399 },
];

const mockJobDetails: Record<string, StaffJobDetail> = {
  JOB001: {
    id: 'JOB001',
    service: 'Premium Car Wash',
    customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210' },
    datetime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: BOOKING_STATUS.CONFIRMED,
    notes: ['Customer prefers eco-friendly products', 'Focus on exterior shine'],
    location: 'Koramangala 5th Block, Bangalore',
    amount: 599,
    vehicleDetails: { type: 'Car', model: 'Honda City 2020', number: 'KA-01-AB-1234' },
    paymentInfo: { method: 'Online', status: 'Paid', amount: 599 },
    statusHistory: [
      { status: 'Confirmed', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), note: 'Job confirmed by customer' },
    ],
  },
};

const mockWorkHistory: StaffJob[] = [
  { id: 'JOB101', service: 'Premium Car Wash', customer: 'Anita Desai', time: '9:00 AM', datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'Koramangala', status: BOOKING_STATUS.COMPLETED, amount: 599, rating: 5 },
  { id: 'JOB102', service: 'Bike Wash', customer: 'Ravi Kumar', time: '11:00 AM', datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'HSR Layout', status: BOOKING_STATUS.COMPLETED, amount: 199, rating: 4 },
  { id: 'JOB103', service: 'Interior Detailing', customer: 'Meera Patel', time: '2:00 PM', datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'Indiranagar', status: BOOKING_STATUS.COMPLETED, amount: 899, rating: 5 },
  { id: 'JOB104', service: 'Full Service', customer: 'Karthik Reddy', time: '4:00 PM', datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'Whitefield', status: BOOKING_STATUS.COMPLETED, amount: 1299, rating: 4 },
  { id: 'JOB105', service: 'Express Wash', customer: 'Deepa Singh', time: '5:30 PM', datetime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), location: 'BTM Layout', status: BOOKING_STATUS.COMPLETED, amount: 399, rating: 5 },
];

export const staffJobsFetchers = {
  async getJobs(filters?: StaffJobFilters): Promise<PaginatedResponse<StaffJob>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredJobs = [...mockJobs];
      
      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.customer.toLowerCase().includes(searchLower) ||
          job.service.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter
      if (filters?.status) {
        filteredJobs = filteredJobs.filter(job => job.status === filters.status);
      }
      
      // Apply date range filters
      if (filters?.fromDate) {
        filteredJobs = filteredJobs.filter(job => {
          const jobDate = job.datetime.split('T')[0];
          return jobDate >= filters.fromDate!;
        });
      }
      
      if (filters?.toDate) {
        filteredJobs = filteredJobs.filter(job => {
          const jobDate = job.datetime.split('T')[0];
          return jobDate <= filters.toDate!;
        });
      }
      
      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
      
      return {
        data: paginatedJobs,
        total: filteredJobs.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(filteredJobs.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<StaffJob>>>(
      StaffRoutes.JOBS,
      { params: filters }
    );
    return data.data!;
  },

  async getJobById(jobId: string): Promise<StaffJobDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const jobDetail = mockJobDetails[jobId];
      if (!jobDetail) {
        throw new Error('Job not found');
      }
      return jobDetail;
    }

    const { data } = await apiClient.get<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId)
    );
    return data.data!;
  },

  async updateJobStatus(
    jobId: string,
    input: UpdateJobStatusInput
  ): Promise<StaffJobDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobDetail = mockJobDetails[jobId];
      if (!jobDetail) {
        throw new Error('Job not found');
      }
      return { ...jobDetail, status: input.status };
    }

    const { data} = await apiClient.patch<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId),
      input
    );
    return data.data!;
  },

  async getWorkHistory(filters?: StaffJobFilters): Promise<StaffJob[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredHistory = [...mockWorkHistory];
      
      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredHistory = filteredHistory.filter(job => 
          job.customer.toLowerCase().includes(searchLower) ||
          job.service.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter
      if (filters?.status) {
        filteredHistory = filteredHistory.filter(job => job.status === filters.status);
      }
      
      // Apply date range filters
      if (filters?.fromDate) {
        filteredHistory = filteredHistory.filter(job => {
          const jobDate = job.datetime.split('T')[0];
          return jobDate >= filters.fromDate!;
        });
      }
      
      if (filters?.toDate) {
        filteredHistory = filteredHistory.filter(job => {
          const jobDate = job.datetime.split('T')[0];
          return jobDate <= filters.toDate!;
        });
      }
      
      return filteredHistory;
    }

    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.HISTORY,
      { params: filters }
    );
    return data.data!;
  },
};
