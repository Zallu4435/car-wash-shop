'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, Plus, Edit, Trash2 } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { useState, useMemo } from 'react';
import { useAdminPosterList, useDeletePoster } from '@/api/domains/admin-marketing/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

export default function PostersPage() {
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

  const { data: postersData, isLoading, error, refetch } = useAdminPosterList(filters);
  const deletePosterMutation = useDeletePoster();

  const posters = postersData?.data || [];
  const totalItems = postersData?.total || 0;
  const totalPages = postersData?.totalPages || 0;
  const filteredPosters = posters; // Already filtered by API

  const handleDelete = async (posterId: string, posterTitle: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Poster?',
      description: 'This will permanently delete this poster. It will no longer be displayed to customers. This action cannot be undone.',
      confirmText: 'Yes, Delete Poster',
      cancelText: 'Cancel',
      itemName: posterTitle,
    });

    if (confirmed) {
      await deletePosterMutation.mutateAsync(posterId);
      toast.success(`Poster "${posterTitle}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading posters..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load posters" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const activePosters = posters.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Marketing Posters
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Upload and display promotional posters
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.POSTER_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create Poster
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          icon={FileImage}
          label="Total Posters"
          value={posters.length}
          change="+11.2%"
          trend="up"
          description="All posters"
        />
        
        <StatCard
          icon={FileImage}
          label="Active Posters"
          value={activePosters}
          valueClassName="text-primary"
          change="+13.7%"
          trend="up"
          description="Currently active"
        />
      </div>

      {/* Posters List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Posters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search posters by title..."
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

          {/* Posters Grid */}
          {filteredPosters.length === 0 ? (
            <EmptyState
              icon={FileImage}
              title="No posters found"
              description={search ? "Try adjusting your search or filters" : "No posters created yet"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.POSTER_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Poster
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredPosters.map((poster) => (
                <TransactionCard
                  key={poster.id}
                  id={poster.id}
                  icon={FileImage}
                  layout="vertical"
                  primaryBadge={{
                    label: poster.location,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: poster.status === 'active' ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={poster.title}
                  subtitle={poster.location}
                  description={`From: ${poster.startDate} | To: ${poster.endDate}`}
                  actionButtons={[
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.POSTER_EDIT(poster.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(poster.id, poster.title),
                      disabled: deletePosterMutation.isPending,
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredPosters.length > 0 && (
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
