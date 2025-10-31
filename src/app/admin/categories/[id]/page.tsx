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
import { toast } from 'sonner';
import Link from 'next/link';
import { DangerZone } from '@/components/admin/DangerZone';

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
      router.push('/admin/categories');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/categories')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
        <Button onClick={() => router.push(`/admin/categories/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">{category.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">Category ID: {category.id}</p>
                  </div>
                </div>
                <Badge variant={category.active ? 'default' : 'secondary'}>
                  {category.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground leading-relaxed">{category.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{category.type}</p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products in Category */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Products ({totalItems})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="space-y-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-md hover:bg-accent transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">{product.image || '📦'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {product.status === 'active' ? 'Active' : product.status === 'out_of_stock' ? 'Out of Stock' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Stock: {product.stock}</span>
                          <span>•</span>
                          <span>Rating: ⭐ {product.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">₹{product.price}</p>
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
        <div className="lg:col-span-1 space-y-6">
          {/* Category Stats */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Category Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                <p className="text-4xl font-bold text-foreground">{category.itemCount}</p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                    Products Listed
                  </p>
                </div>
                <p className="text-4xl font-bold text-foreground">{totalItems}</p>
                <p className="text-xs text-blue-900 dark:text-blue-100 mt-1">In this category</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Products</span>
                  <span className="font-semibold text-foreground">
                    {products.filter((p) => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Product Price</span>
                  <span className="font-semibold text-foreground">
                    {products.length > 0 ? `₹${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category Type</span>
                  <span className="font-semibold text-foreground capitalize">
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
