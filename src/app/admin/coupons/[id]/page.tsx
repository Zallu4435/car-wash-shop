'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Percent, IndianRupee, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';

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
  const deleteConfirmation = useConfirmation();

  const usagePercentage = (coupon.usedCount / coupon.usageLimit) * 100;

  const handleDeleteClick = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Coupon?',
      description: 'This will permanently delete this coupon. Customers will no longer be able to use this code. This action cannot be undone.',
      confirmText: 'Yes, Delete Coupon',
      cancelText: 'Cancel',
      itemName: coupon.code,
    });

    if (confirmed) {
      // TODO: Implement delete coupon API
      toast.success(`Coupon "${coupon.code}" has been deleted`);
      router.push(AdminRoutes.COUPONS);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.COUPONS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Coupons
        </Button>
        <Button onClick={() => router.push(AdminRoutes.COUPON_EDIT(id))} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Coupon Details */}
        <div className="xl:col-span-2">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                  <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
                    <Percent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="font-mono text-xl sm:text-2xl md:text-3xl mb-1">{coupon.code}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">Coupon ID: {coupon.id}</p>
                  </div>
                </div>
                <Badge variant={coupon.active ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                  {coupon.active ? 'Active' : 'Expired'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    {coupon.type === 'percentage' ? (
                      <Percent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Discount</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Min Order</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">₹{coupon.minOrderValue}</p>
                </div>
              </div>

              <Separator />

              <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Valid Until</p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground">{coupon.validUntil}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Stats */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl xl:sticky xl:top-6 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Usage Statistics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mb-0.5 sm:mb-1">Times Used</p>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">{coupon.usedCount}</p>
                </div>

                <div className="p-2.5 sm:p-3 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mb-0.5 sm:mb-1">Remaining</p>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{coupon.usageLimit - coupon.usedCount}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm mb-2">
                  <span className="text-muted-foreground">Usage Progress</span>
                  <span className="font-semibold text-foreground flex-shrink-0">{usagePercentage.toFixed(0)}%</span>
                </div>
                <Progress value={usagePercentage} className="h-2.5 sm:h-3" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  {coupon.usedCount} of {coupon.usageLimit} uses
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this coupon"
            actions={[
              {
                title: 'Delete Coupon',
                description: 'Permanently remove this coupon from the system',
                buttonText: 'Delete',
                buttonIcon: Trash2,
                onClick: handleDeleteClick,
              },
            ]}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
