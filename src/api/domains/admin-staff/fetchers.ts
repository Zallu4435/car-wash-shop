import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminStaff,
  AdminStaffDetail,
  CreateStaffInput,
  UpdateStaffInput,
  StaffFilters,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockStaff: AdminStaff[] = [
  {
    id: 'STF001',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@carwash.com',
    phone: '+91 98765 43210',
    role: 'Senior Technician',
    area: 'Koramangala',
    status: 'active',
    totalJobs: 342,
    avgRating: 4.8,
    earnings: 125600,
    joinedDate: '2023-01-15',
  },
  {
    id: 'STF002',
    name: 'Suresh Patel',
    email: 'suresh.patel@carwash.com',
    phone: '+91 98765 43211',
    role: 'Technician',
    area: 'Indiranagar',
    status: 'active',
    totalJobs: 256,
    avgRating: 4.6,
    earnings: 98400,
    joinedDate: '2023-03-20',
  },
  {
    id: 'STF003',
    name: 'Vijay Singh',
    email: 'vijay.singh@carwash.com',
    phone: '+91 98765 43212',
    role: 'Technician',
    area: 'HSR Layout',
    status: 'active',
    totalJobs: 189,
    avgRating: 4.7,
    earnings: 76800,
    joinedDate: '2023-05-10',
  },
  {
    id: 'STF004',
    name: 'Anil Sharma',
    email: 'anil.sharma@carwash.com',
    phone: '+91 98765 43213',
    role: 'Junior Technician',
    area: 'Whitefield',
    status: 'active',
    totalJobs: 145,
    avgRating: 4.5,
    earnings: 58200,
    joinedDate: '2023-07-01',
  },
  {
    id: 'STF005',
    name: 'Manoj Reddy',
    email: 'manoj.reddy@carwash.com',
    phone: '+91 98765 43214',
    role: 'Technician',
    area: 'BTM Layout',
    status: 'inactive',
    totalJobs: 98,
    avgRating: 4.3,
    earnings: 42100,
    joinedDate: '2023-08-15',
  },
];

const mockStaffDetails: Record<string, AdminStaffDetail> = {
  STF001: {
    ...mockStaff[0],
    skills: ['Car Wash', 'Detailing', 'Polishing', 'Interior Cleaning'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '9:00 AM - 6:00 PM',
    },
    recentJobs: [
      {
        id: 'JOB101',
        service: 'Premium Car Wash',
        customer: 'Rajesh Kumar',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        amount: 599,
      },
      {
        id: 'JOB102',
        service: 'Interior Detailing',
        customer: 'Priya Sharma',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        amount: 899,
      },
    ],
    performanceMetrics: {
      completionRate: 98.5,
      onTimeRate: 96.2,
      customerSatisfaction: 4.8,
    },
  },
};

export const adminStaffFetchers = {
  async getStaffList(filters?: StaffFilters): Promise<PaginatedResponse<AdminStaff>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredStaff = [...mockStaff];

      // Apply filters
      if (filters?.status) {
        filteredStaff = filteredStaff.filter(s => s.status === filters.status);
      }
      if (filters?.role) {
        filteredStaff = filteredStaff.filter(s => s.role === filters.role);
      }
      if (filters?.area) {
        filteredStaff = filteredStaff.filter(s => s.area === filters.area);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredStaff = filteredStaff.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.phone.includes(searchLower)
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

      return {
        data: paginatedStaff,
        total: filteredStaff.length,
        page,
        limit,
        totalPages: Math.ceil(filteredStaff.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminStaff>>>(
      AdminRoutes.STAFF,
      { params: filters }
    );
    return data.data!;
  },

  async getStaffById(staffId: string): Promise<AdminStaffDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const staffDetail = mockStaffDetails[staffId];
      if (!staffDetail) {
        throw new Error('Staff not found');
      }
      return staffDetail;
    }

    const { data } = await apiClient.get<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF_DETAIL(staffId)
    );
    return data.data!;
  },

  async createStaff(input: CreateStaffInput): Promise<AdminStaffDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newStaff: AdminStaffDetail = {
        id: `STF${String(mockStaff.length + 1).padStart(3, '0')}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        area: input.area,
        status: 'active',
        totalJobs: 0,
        avgRating: 0,
        earnings: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        skills: input.skills || [],
        availability: input.availability || { days: [], hours: '' },
        recentJobs: [],
        performanceMetrics: {
          completionRate: 0,
          onTimeRate: 0,
          customerSatisfaction: 0,
        },
      };
      return newStaff;
    }

    const { data } = await apiClient.post<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF,
      input
    );
    return data.data!;
  },

  async updateStaff(staffId: string, input: UpdateStaffInput): Promise<AdminStaffDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const existingStaff = mockStaffDetails[staffId];
      if (!existingStaff) {
        throw new Error('Staff not found');
      }
      const updated: AdminStaffDetail = {
        ...existingStaff,
        ...input,
        availability: input.availability ? {
          days: input.availability.days || existingStaff.availability?.days || [],
          hours: input.availability.hours || existingStaff.availability?.hours || '',
        } : existingStaff.availability,
      };
      return updated;
    }

    const { data } = await apiClient.patch<ApiResponse<AdminStaffDetail>>(
      AdminRoutes.STAFF_DETAIL(staffId),
      input
    );
    return data.data!;
  },

  async deleteStaff(staffId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Staff deleted successfully' };
    }

    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      AdminRoutes.STAFF_DETAIL(staffId)
    );
    return data.data!;
  },

  async updateStaffStatus(staffId: string, status: 'active' | 'inactive' | 'suspended'): Promise<AdminStaffDetail> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const existingStaff = mockStaffDetails[staffId];
      if (!existingStaff) {
        throw new Error('Staff member not found');
      }
      return { ...existingStaff, status };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminStaffDetail>>(
      `${AdminRoutes.STAFF_DETAIL(staffId)}/status`,
      { status }
    );
    return data.data!;
  },
};
