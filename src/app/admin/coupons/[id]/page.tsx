'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Tag, Percent, IndianRupee, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const coupon = {
  id: 'coupon_001',
  code: 'FIRST20',
  type: 'percentage',
  value: 20,
  minOrderValue: 500,
  validUntil: 'December 31, 2025',
  usedCount: 234,
  usageLimit: 1000,
  active: true,
};

export default function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const usagePercentage = (coupon.usedCount / coupon.usageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/coupons')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Coupons
        </Button>
        <Button onClick={() => router.push(`/admin/coupons/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coupon Details */}
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Percent className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-mono text-3xl">{coupon.code}</CardTitle>
                    <p className="text-muted-foreground mt-1">Coupon ID: {coupon.id}</p>
                  </div>
                </div>
                <Badge variant={coupon.active ? 'default' : 'secondary'}>
                  {coupon.active ? 'Active' : 'Expired'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    {coupon.type === 'percentage' ? (
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Discount</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Min Order</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">₹{coupon.minOrderValue}</p>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Valid Until</p>
                </div>
                <p className="font-semibold text-foreground">{coupon.validUntil}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Usage Statistics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Times Used</p>
                <p className="text-4xl font-bold text-foreground">{coupon.usedCount}</p>
              </div>

              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Remaining Uses</p>
                <p className="text-4xl font-bold text-foreground">{coupon.usageLimit - coupon.usedCount}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Usage Progress</span>
                  <span className="font-semibold text-foreground">{usagePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">
                  {coupon.usedCount} of {coupon.usageLimit} uses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
