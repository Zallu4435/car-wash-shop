import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCouponsFetchers } from './fetchers';
import type { CreateCouponInput, UpdateCouponInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminCouponsKeys = {
  all: ['admin-coupons'] as const,
  list: () => [...adminCouponsKeys.all, 'list'] as const,
  detail: (id: string) => [...adminCouponsKeys.all, 'detail', id] as const,
};

export const useAdminCouponList = () => {
  return useQuery({
    queryKey: adminCouponsKeys.list(),
    queryFn: adminCouponsFetchers.getCouponList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminCouponDetail = (couponId: string) => {
  return useQuery({
    queryKey: adminCouponsKeys.detail(couponId),
    queryFn: () => adminCouponsFetchers.getCouponById(couponId),
    enabled: !!couponId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCouponInput) => adminCouponsFetchers.createCoupon(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCouponsKeys.all });
      toast.success('Coupon created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create coupon');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ couponId, input }: { couponId: string; input: UpdateCouponInput }) =>
      adminCouponsFetchers.updateCoupon(couponId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminCouponsKeys.detail(variables.couponId), data);
      queryClient.invalidateQueries({ queryKey: adminCouponsKeys.all });
      toast.success('Coupon updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update coupon');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (couponId: string) => adminCouponsFetchers.deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCouponsKeys.all });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete coupon');
    },
  });
};
