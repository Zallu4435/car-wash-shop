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
import { ArrowLeft, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
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
      router.push('/admin/coupons');
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/coupons')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupons
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Coupon</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a new discount coupon</p>
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
                placeholder="e.g., SAVE100"
                className="font-mono uppercase"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.code.message}</p>
              )}
              {!errors.code && (
                <p className="text-xs text-muted-foreground">Use uppercase letters and numbers only</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the coupon offer..."
                rows={3}
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
                <p className="text-xs text-red-600 dark:text-red-400">{errors.discountType.message}</p>
              )}
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="100"
                {...register('discountValue', { valueAsNumber: true })}
              />
              {errors.discountValue && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.discountValue.message}</p>
              )}
              {!errors.discountValue && (
                <p className="text-xs text-muted-foreground">Amount in ₹ or percentage value</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Min Order Value */}
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Min Order (₹) <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  placeholder="500"
                  {...register('minOrderAmount', { valueAsNumber: true })}
                />
                {errors.minOrderAmount && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.minOrderAmount.message}</p>
                )}
              </div>

              {/* Max Discount */}
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount (₹) <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  placeholder="1000"
                  {...register('maxDiscount', { valueAsNumber: true })}
                />
                {errors.maxDiscount && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.maxDiscount.message}</p>
                )}
              </div>
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
              {!errors.usageLimit && (
                <p className="text-xs text-muted-foreground">Total number of times this coupon can be used</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Coupon is available for use</p>
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

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isSubmitting}>
              <Plus className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
