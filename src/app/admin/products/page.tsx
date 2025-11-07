'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminProductList, useDeleteProduct } from '@/api/domains/admin-catalog/queries';
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

export default function ProductsPage() {
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
    category: filterValues.category || undefined,
    stock: filterValues.stock || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: productsResponse, isLoading, error, refetch } = useAdminProductList(filters);
  const deleteProductMutation = useDeleteProduct();

  const products = productsResponse?.data || [];
  const totalItems = productsResponse?.total || 0;
  const totalPages = productsResponse?.totalPages || 0;
  const filteredProducts = products; // Already filtered by API

  const handleDelete = async (productId: string, productName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Product?',
      description: 'This will permanently delete this product. Customers will no longer be able to purchase this product. This action cannot be undone.',
      confirmText: 'Yes, Delete Product',
      cancelText: 'Cancel',
      itemName: productName,
    });

    if (confirmed) {
      await deleteProductMutation.mutateAsync(productId);
      toast.success(`Product "${productName}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading products..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load products" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }
  const lowStockItems = products.filter(p => p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.PRODUCT_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          change="+7.2%"
          trend="up"
          description="All products"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Inventory Value"
          value={`₹${totalValue.toLocaleString()}`}
          valueClassName="text-primary"
          change="+14.5%"
          trend="up"
          description="Total value"
        />
        
        <StatCard
          icon={Package}
          label="Total Stock"
          value={products.reduce((sum, p) => sum + p.stock, 0)}
          change="+3.8%"
          trend="up"
          description="Items in stock"
        />
        
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStockItems}
          change="-2.1%"
          trend="down"
          description="Needs restock"
        />
      </div>

      {/* Products List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search products by name or category..."
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
              {
                label: 'Category',
                value: 'category',
                options: [
                  { label: 'All Categories', value: '' },
                  { label: 'Cleaning', value: 'cleaning' },
                  { label: 'Polish', value: 'polish' },
                  { label: 'Accessories', value: 'accessories' },
                  { label: 'Tools', value: 'tools' },
                ],
              },
              {
                label: 'Stock Status',
                value: 'stock',
                options: [
                  { label: 'All Stock', value: '' },
                  { label: 'In Stock', value: 'in-stock' },
                  { label: 'Low Stock', value: 'low-stock' },
                  { label: 'Out of Stock', value: 'out-of-stock' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description={search ? "Try adjusting your search or filters" : "No products available"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.PRODUCT_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = product.stock > 10 ? 'good' : product.stock > 0 ? 'low' : 'out';
                const stockColor = stockStatus === 'good'
                  ? 'text-green-600 dark:text-green-400'
                  : stockStatus === 'low'
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-red-600 dark:text-red-400';
                
                return (
                  <TransactionCard
                    key={product.id}
                    id={product.id}
                    icon={Package}
                    imageUrl={product.image}
                    layout="vertical"
                    primaryBadge={{
                      label: typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A',
                      variant: 'outline',
                    }}
                    statusBadge={{
                      label: product.active ? 'Active' : 'Inactive',
                      className: '',
                    }}
                    title={product.name}
                    subtitle={typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'N/A'}
                    infoBoxes={[
                      {
                        icon: IndianRupee,
                        label: 'Price',
                        value: `₹${product.price}`,
                        valueClassName: 'text-primary',
                      },
                      {
                        icon: Package,
                        label: 'Stock',
                        value: `${product.stock} units`,
                        valueClassName: stockColor,
                      },
                    ]}
                    actionButtons={[
                      {
                        label: 'View',
                        icon: Eye,
                        onClick: () => router.push(AdminRoutes.PRODUCT_DETAIL(product.id)),
                        hideTextOnMobile: true,
                      },
                      {
                        label: 'Edit',
                        icon: Edit,
                        onClick: () => router.push(AdminRoutes.PRODUCT_EDIT(product.id)),
                        hideTextOnMobile: true,
                      },
                      {
                        label: '',
                        icon: Trash2,
                        onClick: () => handleDelete(product.id, product.name),
                        disabled: deleteProductMutation.isPending,
                        className: 'text-destructive hover:bg-destructive/10 flex-initial px-2 sm:px-3',
                      },
                    ]}
                  />
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {filteredProducts.length > 0 && (
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
