'use client';

// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyCouponSchema, ApplyCouponInput } from '@/schemas/coupon';

interface CouponInputProps {
  onApply: (code: string) => Promise<void> | void;
  onRemove?: () => void;
  appliedCoupon?: string;
  discount?: number;
  isLoading?: boolean;
  subtotal: number;
  minOrderAmount?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CouponInput({
  onApply,
  onRemove,
  appliedCoupon,
  discount = 0,
  isLoading = false,
  subtotal,
  minOrderAmount = 100,
  showLabel = true,
  size = 'md',
}: CouponInputProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyCouponInput>({
    resolver: zodResolver(applyCouponSchema) as any,
    defaultValues: {
      amount: subtotal,
    },
  });

  const onSubmit = async (data: ApplyCouponInput) => {
    // Validate minimum order amount
    if (subtotal < minOrderAmount) {
      return;
    }

    await onApply(data.code);
    reset();
  };

  const handleRemove = () => {
    reset();
    onRemove?.();
  };

  const heightClass = {
    sm: 'h-9',
    md: 'h-10',
    lg: 'h-11',
  }[size];

  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm',
  }[size];

  // If coupon is applied, show the applied state
  if (appliedCoupon) {
    return (
      <div className="space-y-2">
        {showLabel && (
          <Label className={textSizeClass}>Applied Coupon</Label>
        )}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                {appliedCoupon}
              </p>
              <p className="text-[10px] text-green-700 dark:text-green-300">
                Saved ₹{discount}
              </p>
            </div>
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/40"
            >
              <X className="h-4 w-4 text-green-600 dark:text-green-400" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show coupon input form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {showLabel && (
        <Label htmlFor="couponCode" className={textSizeClass}>
          Have a coupon code?
        </Label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="couponCode"
            {...register('code')}
            placeholder="Enter code"
            className={`${heightClass} ${textSizeClass} uppercase`}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size={size === 'md' ? 'default' : size}
          className={heightClass}
          disabled={isLoading || subtotal < minOrderAmount}
        >
          <Tag className="h-4 w-4 mr-1" />
          {isLoading ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      {errors.code && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {errors.code.message}
        </p>
      )}
      {subtotal < minOrderAmount && (
        <p className="text-xs text-orange-600 dark:text-orange-400">
          Minimum order of ₹{minOrderAmount} required to apply coupon
        </p>
      )}
    </form>
  );
}
