'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function CouponsPage() {
  const router = useRouter();
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

  const handleDelete = async (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      await deleteCouponMutation.mutateAsync(couponId);
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
        <Button onClick={() => router.push(AdminRoutes.COUPON_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
          className="sm:col-span-2 md:col-span-1"
        />
      </div>

      {/* Coupon List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Coupons</CardTitle>
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
              {filteredCoupons.map((coupon) => (
              <Card key={coupon.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          {coupon.type === 'percentage' ? (
                            <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          ) : (
                            <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                        </div>
                        <h3 className="font-mono font-bold text-lg sm:text-xl text-foreground truncate">
                          {coupon.code}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                      </p>
                    </div>
                    <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {coupon.status === 'active' ? 'Active' : 'Expired'}
                    </Badge>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                        Min Order Value
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        ₹{coupon.minOrderValue}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Used</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground">
                          {coupon.usedCount}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Limit</p>
                        <p className="font-semibold text-sm sm:text-base text-foreground">
                          {coupon.usageLimit}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                        Valid Until
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {coupon.validUntil}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(AdminRoutes.COUPON_DETAIL(coupon.id))}
                    >
                      <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(AdminRoutes.COUPON_EDIT(coupon.id))}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
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
    </div>
  );
}
