'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

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
        <Button onClick={() => router.push('/admin/products/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <Package className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">All Products</CardTitle>
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
                  <Button onClick={() => router.push('/admin/products/new')}>
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
                return (
                  <Card key={product.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <Package className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                              {product.name}
                            </h3>
                            <Badge variant="outline" className="text-xs mt-0.5 sm:mt-1">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={product.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="p-2.5 sm:p-3 bg-muted rounded-lg border border-border">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Price</p>
                          </div>
                          <p className="text-base sm:text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>
                            ₹{product.price}
                          </p>
                        </div>
                        <div 
                          className="p-2.5 sm:p-3 rounded-lg border"
                          style={{
                            backgroundColor: stockStatus === 'good' 
                              ? 'hsl(160 60% 45% / 0.1)' 
                              : stockStatus === 'low' 
                              ? 'hsl(30 80% 55% / 0.1)' 
                              : 'hsl(0 63% 55% / 0.1)',
                            borderColor: stockStatus === 'good'
                              ? 'hsl(160 60% 45% / 0.3)'
                              : stockStatus === 'low'
                              ? 'hsl(30 80% 55% / 0.3)'
                              : 'hsl(0 63% 55% / 0.3)'
                          }}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Stock</p>
                          </div>
                          <p 
                            className="text-base sm:text-lg font-bold"
                            style={{
                              color: stockStatus === 'good'
                                ? 'hsl(160 60% 45%)'
                                : stockStatus === 'low'
                                ? 'hsl(30 80% 55%)'
                                : 'hsl(0 63% 55%)'
                            }}
                          >
                            {product.stock} <span className="text-xs sm:text-sm">units</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-9 text-xs sm:text-sm"
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                        >
                          <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">View</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-9 text-xs sm:text-sm"
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        >
                          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ color: 'hsl(0 63% 55%)' }}
                          className="hover:bg-destructive/10 border-border h-9 px-3"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
