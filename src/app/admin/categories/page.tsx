'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Folder, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminCategoryList, useDeleteCategory } from '@/api/domains/admin-catalog/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { StatCard } from '@/components/admin/StatCard';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';

export default function CategoriesPage() {
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

  const { data: categoriesResponse, isLoading, error, refetch } = useAdminCategoryList(filters);
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesResponse?.data || [];
  const totalItems = categoriesResponse?.total || 0;
  const totalPages = categoriesResponse?.totalPages || 0;

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Category?',
      description: 'This will permanently delete this category. Products in this category will need to be reassigned. This action cannot be undone.',
      confirmText: 'Yes, Delete Category',
      cancelText: 'Cancel',
      itemName: categoryName,
    });

    if (confirmed) {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast.success(`Category "${categoryName}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading categories..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load categories" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const filteredCategories = categories; // Already filtered by API
  const activeCategories = categories.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Organize services and products
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.CATEGORY_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={Folder}
          label="Total Categories"
          value={categories.length}
          change="+4.2%"
          trend="up"
          description="All categories"
        />
        
        <StatCard
          icon={CheckCircle}
          label="Active Categories"
          value={activeCategories}
          valueClassName="text-primary"
          change="+6.5%"
          trend="up"
          description="Currently active"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Usage Rate"
          value={`${activeCategories > 0 ? Math.round((activeCategories / categories.length) * 100) : 0}%`}
          change="+2.3%"
          trend="up"
          description="Active vs total"
          className="sm:col-span-2 md:col-span-1"
        />
      </div>

      {/* Categories List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search categories..."
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

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <EmptyState
              icon={Folder}
              title="No categories found"
              description={search ? "Try adjusting your search or filters" : "No categories available"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.CATEGORY_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                )
              }
            />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredCategories.map((category) => (
              <TransactionCard
                key={category.id}
                id={category.id}
                icon={Folder}
                layout="vertical"
                primaryBadge={{
                  label: `${category.itemCount} items`,
                  variant: 'outline',
                }}
                statusBadge={{
                  label: category.status === 'active' ? 'Active' : 'Inactive',
                  className: '',
                }}
                title={category.name}
                subtitle={`${category.itemCount} items`}
                infoBoxes={[
                  {
                    icon: CheckCircle,
                    label: 'Items',
                    value: category.itemCount,
                  },
                ]}
                actionButtons={[
                  {
                    label: 'View',
                    icon: Eye,
                    onClick: () => router.push(AdminRoutes.CATEGORY_DETAIL(category.id)),
                    hideTextOnMobile: true,
                  },
                  {
                    label: '',
                    icon: Edit,
                    onClick: () => router.push(AdminRoutes.CATEGORY_EDIT(category.id)),
                    className: 'flex-initial px-3',
                  },
                  {
                    label: '',
                    icon: Trash2,
                    onClick: () => handleDelete(category.id, category.name),
                    disabled: deleteCategoryMutation.isPending,
                    className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                  },
                ]}
              />
            ))}
          </div>
          )}
          
          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
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
