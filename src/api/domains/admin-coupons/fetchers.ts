import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AdminCoupon,
  CreateCouponInput,
  UpdateCouponInput,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminCouponsFetchers = {
  async getCouponList(): Promise<AdminCoupon[]> {
    const { data } = await apiClient.get<ApiResponse<AdminCoupon[]>>(
      AdminRoutes.COUPONS
    );
    return data.data!;
  },

  async getCouponById(couponId: string): Promise<AdminCoupon> {
    const { data } = await apiClient.get<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPON_DETAIL(couponId)
    );
    return data.data!;
  },

  async createCoupon(input: CreateCouponInput): Promise<AdminCoupon> {
    const { data } = await apiClient.post<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPONS,
      input
    );
    return data.data!;
  },

  async updateCoupon(couponId: string, input: UpdateCouponInput): Promise<AdminCoupon> {
    const { data } = await apiClient.patch<ApiResponse<AdminCoupon>>(
      AdminRoutes.COUPON_DETAIL(couponId),
      input
    );
    return data.data!;
  },

  async deleteCoupon(couponId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      AdminRoutes.COUPON_DETAIL(couponId)
    );
    return data.data!;
  },
};
