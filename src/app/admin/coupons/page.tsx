'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tag, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Percent,
  IndianRupee,
  TrendingUp
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminCouponList, useDeleteCoupon } from '@/api/domains/admin-coupons/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { AdminRoutes } from '@/lib/constants/routes';
import { StatCard } from '@/components/admin/StatCard';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { Calendar, Users, Target } from 'lucide-react';

export default function CouponsPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: couponsData, isLoading, error, refetch } = useAdminCouponList(filters);
  const deleteCouponMutation = useDeleteCoupon();

  const coupons = couponsData?.data || [];
  const totalItems = couponsData?.total || 0;
  const totalPages = couponsData?.totalPages || 0;
  const filteredCoupons = coupons; // Already filtered by API

  const handleDelete = async (couponId: string, couponCode: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Coupon?',
      description: 'This will permanently delete this coupon. Customers will no longer be able to use this code. This action cannot be undone.',
      confirmText: 'Yes, Delete Coupon',
      cancelText: 'Cancel',
      itemName: couponCode,
    });

    if (confirmed) {
      await deleteCouponMutation.mutateAsync(couponId);
      toast.success(`Coupon "${couponCode}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading coupons..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load coupons" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum: number, c: any) => sum + (c.usedCount || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Coupons
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage discount coupons and promotions
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.COUPON_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={Tag}
          label="Total Coupons"
          value={totalItems}
          change="+6.8%"
          trend="up"
          description="All coupons"
        />
        
        <StatCard
          icon={Tag}
          label="Active Coupons"
          value={activeCoupons}
          valueClassName="text-primary"
          change="+10.5%"
          trend="up"
          description="Currently active"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Total Uses"
          value={totalUsage}
          change="+24.3%"
          trend="up"
          description="All time usage"
          className="xs:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Coupon List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Coupons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search coupons by code..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Expired', value: 'expired' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Coupon Grid */}
          {filteredCoupons.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="No coupons found"
              description={search ? "Try adjusting your search or filters" : "No coupons created yet"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.COUPON_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredCoupons.map((coupon) => {
                const discountIcon = coupon.type === 'percentage' ? Percent : IndianRupee;
                const discountValue = coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`;
                
                return (
                  <TransactionCard
                    key={coupon.id}
                    id={coupon.id}
                    icon={discountIcon}
                    layout="vertical"
                    primaryBadge={{
                      label: coupon.code,
                      variant: 'outline',
                      className: 'font-mono',
                    }}
                    statusBadge={{
                      label: coupon.status === 'active' ? 'Active' : 'Expired',
                      className: '',
                    }}
                    title={coupon.code}
                    subtitle={discountValue}
                    description={`Min Order: ₹${coupon.minOrderValue} | Valid Until: ${coupon.validUntil}`}
                    infoBoxes={[
                      {
                        icon: Users,
                        label: 'Used',
                        value: coupon.usedCount,
                      },
                      {
                        icon: Target,
                        label: 'Limit',
                        value: coupon.usageLimit,
                      },
                    ]}
                    actionButtons={[
                      {
                        label: 'View',
                        icon: Eye,
                        onClick: () => router.push(AdminRoutes.COUPON_DETAIL(coupon.id)),
                        hideTextOnMobile: true,
                      },
                      {
                        label: 'Edit',
                        icon: Edit,
                        onClick: () => router.push(AdminRoutes.COUPON_EDIT(coupon.id)),
                        hideTextOnMobile: true,
                      },
                      {
                        label: '',
                        icon: Trash2,
                        onClick: () => handleDelete(coupon.id, coupon.code),
                        disabled: deleteCouponMutation.isPending,
                        className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                      },
                    ]}
                  />
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {filteredCoupons.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1); // Reset to first page when changing page size
              }}
              className="mt-4 sm:mt-6"
            />
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
