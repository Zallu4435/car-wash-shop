'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Package, Trash2, TrendingUp, IndianRupee, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useAdminCategoryDetail, useAdminProductList, useDeleteCategory } from '@/api/domains/admin-catalog/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import Link from 'next/link';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  
  // State for search, filter, and pagination
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // API calls
  const { data: category, isLoading: categoryLoading, error: categoryError } = useAdminCategoryDetail(id);
  const { data: productsResponse, isLoading: productsLoading } = useAdminProductList({
    category: id,
    search: search || undefined,
    status: filterValues.status || undefined,
    page,
    pageSize,
  });
  const deleteCategoryMutation = useDeleteCategory();

  const products = productsResponse?.data || [];
  const totalItems = productsResponse?.total || 0;
  const totalPages = productsResponse?.totalPages || 0;

  const handleDeleteClick = async () => {
    if (!category) return;
    
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Category?',
      description: 'This will permanently delete this category. Products in this category will need to be reassigned. This action cannot be undone.',
      confirmText: 'Yes, Delete Category',
      cancelText: 'Cancel',
      itemName: category.name,
    });

    if (confirmed) {
      deleteCategoryMutation.mutate(id);
      router.push(AdminRoutes.CATEGORIES);
    }
  };

  // Loading state
  if (categoryLoading) {
    return <Loading text="Loading category details..." />;
  }

  // Error state
  if (categoryError || !category) {
    return (
      <Error 
        message="Failed to load category" 
        details={categoryError?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.CATEGORIES)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Categories
        </Button>
        <Button onClick={() => router.push(AdminRoutes.CATEGORY_EDIT(id))} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Category
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Category Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Info */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                  <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
                    <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-1">{category.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">Category ID: {category.id}</p>
                  </div>
                </div>
                <Badge variant={category.active ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                  {category.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Description</p>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{category.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Type</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground capitalize">{category.type}</p>
                </div>
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Created</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products in Category */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Products ({totalItems})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Search and Filter */}
              <SearchFilter
                onSearchChange={setSearch}
                searchPlaceholder="Search products..."
                filterOptions={[
                  {
                    label: 'Status',
                    value: 'status',
                    options: [
                      { label: 'All Products', value: '' },
                      { label: 'Active Only', value: 'active' },
                      { label: 'Inactive Only', value: 'inactive' },
                    ],
                  },
                ]}
                onFilterChange={setFilterValues}
              />

              {/* Products List */}
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={AdminRoutes.PRODUCT_DETAIL(product.id)}
                    className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl hover:shadow-md hover:bg-accent transition-all cursor-pointer group border-2 border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full xs:w-auto">
                      <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{product.image || '📦'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <p className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {product.name}
                          </p>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs flex-shrink-0">
                            {product.status === 'active' ? 'Active' : product.status === 'out_of_stock' ? 'Out of Stock' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                          <span>Stock: {product.stock}</span>
                          <span className="hidden xs:inline">•</span>
                          <span>⭐ {product.rating.toFixed(1)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline truncate">{product.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left xs:text-right w-full xs:w-auto flex-shrink-0">
                      <p className="text-base sm:text-lg md:text-xl font-bold text-primary">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {search || filterValues.status ? 'No products found' : 'No products yet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {search || filterValues.status
                      ? 'Try adjusting your search or filters' 
                      : 'Products will appear here once added'}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && (
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
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Category Stats */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl xl:sticky xl:top-6 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Category Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Items</p>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{category.itemCount}</p>
              </div>

              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Products Listed
                  </p>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-primary">{totalItems}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">In this category</p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Active Products</span>
                  <span className="font-semibold text-foreground flex-shrink-0">
                    {products.filter((p) => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Avg Product Price</span>
                  <span className="font-semibold text-foreground flex-shrink-0">
                    {products.length > 0 ? `₹${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Category Type</span>
                  <span className="font-semibold text-foreground capitalize flex-shrink-0">
                    {category.type}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this category"
            actions={[
              {
                title: 'Delete Category',
                description: 'Permanently remove this category from the system',
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
