'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Plus, Eye, Edit, Trash2, TrendingUp, MousePointer } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { useState, useMemo } from 'react';
import { useAdminBannerList, useDeleteBanner } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

export default function BannersPage() {
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

  const { data: bannersData, isLoading, error, refetch } = useAdminBannerList(filters);
  const deleteBannerMutation = useDeleteBanner();

  const banners = bannersData?.data || [];
  const totalItems = bannersData?.total || 0;
  const totalPages = bannersData?.totalPages || 0;
  const filteredBanners = banners; // Already filtered by API

  const handleDelete = async (bannerId: string, bannerTitle: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Banner?',
      description: 'This will permanently delete this banner. It will no longer be displayed to customers. This action cannot be undone.',
      confirmText: 'Yes, Delete Banner',
      cancelText: 'Cancel',
      itemName: bannerTitle,
    });

    if (confirmed) {
      await deleteBannerMutation.mutateAsync(bannerId);
      toast.success(`Banner "${bannerTitle}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading banners..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load banners" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const activeBanners = banners.filter(b => b.status === 'active').length;
  const inactiveBanners = banners.filter(b => b.status === 'inactive').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Marketing Banners
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage promotional banners and ads
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.BANNER_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Image}
          label="Total Banners"
          value={banners.length}
          change="+8.5%"
          trend="up"
          description="All banners"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Active Banners"
          value={activeBanners}
          valueClassName="text-primary"
          change="+12.3%"
          trend="up"
          description="Currently active"
        />
        
        <StatCard
          icon={MousePointer}
          label="Total Clicks"
          value={banners.reduce((sum, b) => sum + (b.clicks || 0), 0)}
          change="+18.7%"
          trend="up"
          description="All time"
        />
        
        <StatCard
          icon={Eye}
          label="Total Views"
          value={banners.reduce((sum, b) => sum + (b.impressions || 0), 0)}
          change="+15.2%"
          trend="up"
          description="All time"
        />
      </div>

      {/* Banners List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Banners</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search banners by title..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Banners Grid */}
          {filteredBanners.length === 0 ? (
            <EmptyState
              icon={Image}
              title="No banners found"
              description={search ? "Try adjusting your search or filters" : "No banners created yet"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.BANNER_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Banner
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredBanners.map((banner) => {
              const ctr = banner.clicks && banner.impressions ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : '0.00';
              return (
                <TransactionCard
                  key={banner.id}
                  id={banner.id}
                  icon={Image}
                  layout="vertical"
                  primaryBadge={{
                    label: `${banner.position}`,
                    variant: 'outline',
                    className: 'capitalize',
                  }}
                  statusBadge={{
                    label: banner.status === 'active' ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={banner.title}
                  subtitle={`Displaying on: ${banner.pages}`}
                  description={`${banner.startDate} to ${banner.endDate}`}
                  infoBoxes={[
                    {
                      icon: Eye,
                      label: 'Views',
                      value: (banner.impressions || 0).toLocaleString(),
                    },
                    {
                      icon: MousePointer,
                      label: 'Clicks',
                      value: (banner.clicks || 0).toLocaleString(),
                    },
                    {
                      icon: TrendingUp,
                      label: 'CTR',
                      value: `${ctr}%`,
                      valueClassName: 'text-primary',
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.BANNER_EDIT(banner.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(banner.id, banner.title),
                      disabled: deleteBannerMutation.isPending,
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {filteredBanners.length > 0 && (
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
