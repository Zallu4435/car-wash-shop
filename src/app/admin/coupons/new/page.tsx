'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import { adminCouponSchema, AdminCouponFormInput } from '@/schemas/admin/coupon';

export default function NewCouponPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminCouponFormInput>({
    resolver: zodResolver(adminCouponSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: AdminCouponFormInput) => {
    try {
      console.log('Coupon data:', data);
      toast.success('Coupon created successfully!');
      router.push(AdminRoutes.COUPONS);
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.COUPONS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Coupons
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Create New Coupon</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Add a new discount coupon</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Coupon Code */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="code" className="text-xs sm:text-sm">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g., SAVE100"
                className="font-mono uppercase h-9 sm:h-10 text-xs sm:text-sm"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.code.message}</p>
              )}
              {!errors.code && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Use uppercase letters and numbers only</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the coupon offer..."
                rows={3}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Discount Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="discountType" className="text-xs sm:text-sm">Discount Type</Label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="discountType" className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.discountType && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.discountType.message}</p>
              )}
            </div>

            {/* Discount Value */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="discountValue" className="text-xs sm:text-sm">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="100"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('discountValue', { valueAsNumber: true })}
              />
              {errors.discountValue && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.discountValue.message}</p>
              )}
              {!errors.discountValue && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Amount in ₹ or percentage value</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Min Order Value */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="minOrderAmount" className="text-xs sm:text-sm">Min Order (₹) <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  placeholder="500"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('minOrderAmount', { valueAsNumber: true })}
                />
                {errors.minOrderAmount && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.minOrderAmount.message}</p>
                )}
              </div>

              {/* Max Discount */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="maxDiscount" className="text-xs sm:text-sm">Max Discount (₹) <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  placeholder="1000"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('maxDiscount', { valueAsNumber: true })}
                />
                {errors.maxDiscount && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.maxDiscount.message}</p>
                )}
              </div>
            </div>

            {/* Usage Limit */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="usageLimit" className="text-xs sm:text-sm">Usage Limit <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="1000"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('usageLimit', { valueAsNumber: true })}
              />
              {errors.usageLimit && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.usageLimit.message}</p>
              )}
              {!errors.usageLimit && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">Total number of times this coupon can be used</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Valid From */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="validFrom" className="text-xs sm:text-sm">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('validFrom')}
                />
                {errors.validFrom && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.validFrom.message}</p>
                )}
              </div>

              {/* Valid Until */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="validUntil" className="text-xs sm:text-sm">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('validUntil')}
                />
                {errors.validUntil && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.validUntil.message}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Coupon is available for use</p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="flex-shrink-0"
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
