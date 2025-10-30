import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  AdminCoupon,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockCoupons: AdminCoupon[] = [
  {
    id: 'CPN001',
    code: 'FIRST50',
    description: '50% off on first booking',
    type: 'percentage',
    value: 50,
    minOrderValue: 500,
    maxDiscount: 250,
    usageLimit: 100,
    usedCount: 45,
    status: 'active',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    createdAt: '2024-01-01',
  },
  {
    id: 'CPN002',
    code: 'SAVE100',
    description: 'Flat ₹100 off on orders above ₹1000',
    type: 'fixed',
    value: 100,
    minOrderValue: 1000,
    usageLimit: 200,
    usedCount: 128,
    status: 'active',
    validFrom: '2024-01-15',
    validUntil: '2024-06-30',
    createdAt: '2024-01-15',
  },
  {
    id: 'CPN003',
    code: 'PREMIUM20',
    description: '20% off on premium services',
    type: 'percentage',
    value: 20,
    minOrderValue: 800,
    maxDiscount: 300,
    usageLimit: 50,
    usedCount: 32,
    status: 'active',
    validFrom: '2024-02-01',
    validUntil: '2024-05-31',
    createdAt: '2024-02-01',
  },
  {
    id: 'CPN004',
    code: 'WINTER25',
    description: '25% off winter special',
    type: 'percentage',
    value: 25,
    minOrderValue: 600,
    maxDiscount: 200,
    usageLimit: 75,
    usedCount: 75,
    status: 'expired',
    validFrom: '2023-12-01',
    validUntil: '2024-02-28',
    createdAt: '2023-12-01',
  },
];

export const adminCouponsFetchers = {
  async getCouponList(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminCoupon>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredCoupons = [...mockCoupons];

      // Apply filters
      if (filters?.status) {
        filteredCoupons = filteredCoupons.filter(c => c.status === filters.status);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCoupons = filteredCoupons.filter(c =>
          c.code.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

      return {
        data: paginatedCoupons,
        total: filteredCoupons.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCoupons.length / limit),
      };
    }

    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminCoupon>>>(
      AdminRoutes.COUPONS,
      { params: filters }
    );
    return data.data!;
  },

  async getCouponById(couponId: string): Promise<AdminCoupon> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const coupon = mockCoupons.find(c => c.id === couponId);
      if (!coupon) throw new Error('Coupon not found');
      return coupon;
    }

    const { data } = await apiClient.get<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPON_DETAIL(couponId)
    );
    return data.data!;
  },

  async createCoupon(input: CreateCouponInput): Promise<AdminCoupon> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `CPN${String(mockCoupons.length + 1).padStart(3, '0')}`,
        code: input.code,
        description: input.description,
        type: input.type,
        value: input.value,
        minOrderValue: input.minOrderValue,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit,
        usedCount: 0,
        status: 'active',
        validFrom: input.validFrom,
        validUntil: input.validUntil,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }

    const { data } = await apiClient.post<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPONS,
      input
    );
    return data.data!;
  },

  async updateCoupon(couponId: string, input: UpdateCouponInput): Promise<AdminCoupon> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const coupon = mockCoupons.find(c => c.id === couponId);
      if (!coupon) throw new Error('Coupon not found');
      return { ...coupon, ...input };
    }

    const { data } = await apiClient.patch<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPON_DETAIL(couponId),
      input
    );
    return data.data!;
  },

  async deleteCoupon(couponId: string): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Coupon deleted successfully' };
    }

    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      AdminRoutes.COUPON_DETAIL(couponId)
    );
    return data.data!;
  },
};
