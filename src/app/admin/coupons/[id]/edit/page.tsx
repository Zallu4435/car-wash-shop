'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { adminCouponSchema, AdminCouponFormInput } from '@/schemas/admin/coupon';

// Mock data - replace with actual data fetching
const mockCoupon = {
  code: 'FIRST20',
  description: 'First time user discount',
  discountType: 'percentage' as const,
  discountValue: 20,
  minOrderAmount: 500,
  usageLimit: 1000,
  validFrom: '2025-01-01',
  validUntil: '2025-12-31',
  active: true,
};

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminCouponFormInput>({
    resolver: zodResolver(adminCouponSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const code = watch('code') || '';
  const discountType = watch('discountType') || 'percentage';
  const discountValue = watch('discountValue') || 0;
  const minOrderAmount = watch('minOrderAmount') || 0;
  const usageLimit = watch('usageLimit') || 0;
  const validUntil = watch('validUntil') || '';
  const active = watch('active') || false;

  useEffect(() => {
    // TODO: Fetch coupon data from API
    reset({
      code: mockCoupon.code,
      description: mockCoupon.description,
      discountType: mockCoupon.discountType,
      discountValue: mockCoupon.discountValue,
      minOrderAmount: mockCoupon.minOrderAmount,
      usageLimit: mockCoupon.usageLimit,
      validFrom: mockCoupon.validFrom,
      validUntil: mockCoupon.validUntil,
      active: mockCoupon.active,
    });
  }, [id, reset]);

  const onSubmit = async (data: AdminCouponFormInput) => {
    try {
      console.log('Updating coupon:', id, data);
      toast.success('Coupon updated successfully!');
      router.push('/admin/coupons');
    } catch (error) {
      toast.error('Failed to update coupon');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(`/admin/coupons/${id}`)} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupon Details
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Save className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Coupon</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Coupon ID: {id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g., FIRST20"
                className="font-mono uppercase"
                {...register('code', {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }
                })}
              />
              {errors.code && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Use uppercase letters and numbers only</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., First time user discount"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="discountType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.discountType && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.discountType.message}</p>
              )}
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="20"
                {...register('discountValue', { valueAsNumber: true })}
              />
              {errors.discountValue && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.discountValue.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {discountType === 'percentage' 
                  ? 'Enter percentage value (e.g., 20 for 20% off)' 
                  : 'Enter amount in rupees'}
              </p>
            </div>

            {/* Min Order Amount */}
            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Minimum Order Amount (₹) <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Input
                id="minOrderAmount"
                type="number"
                placeholder="500"
                {...register('minOrderAmount', { valueAsNumber: true })}
              />
              {errors.minOrderAmount && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.minOrderAmount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum cart value required to use this coupon
              </p>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="1000"
                {...register('usageLimit', { valueAsNumber: true })}
              />
              {errors.usageLimit && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.usageLimit.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Total number of times this coupon can be used
              </p>
            </div>

            {/* Valid From */}
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                {...register('validFrom')}
              />
              {errors.validFrom && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.validFrom.message}</p>
              )}
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                {...register('validUntil')}
              />
              {errors.validUntil && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.validUntil.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Coupon expiration date
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Coupon is available for use
                </p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Changes will be applied immediately. Make sure all information is correct before saving.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push(`/admin/coupons/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg" disabled={isSubmitting}>
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Updating...' : 'Update Coupon'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Preview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-card rounded-xl border-2 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coupon Code</p>
                <p className="text-2xl font-mono font-bold text-foreground">{code || 'COUPON'}</p>
              </div>
              {active ? (
                <div className="px-3 py-1 bg-green-100 dark:bg-green-950/30 rounded-full">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400">Active</p>
                </div>
              ) : (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Inactive</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Get{' '}
                <span className="font-bold text-primary">
                  {discountType === 'percentage' ? `${discountValue}% OFF` : `₹${discountValue} OFF`}
                </span>
                {minOrderAmount ? (
                  <>
                    {' '}on orders above{' '}
                    <span className="font-semibold">₹{minOrderAmount}</span>
                  </>
                ) : null}
              </p>
              <p className="text-xs text-muted-foreground">
                Valid until {validUntil} {usageLimit ? `• ${usageLimit} uses available` : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
