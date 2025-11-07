'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Package, IndianRupee, TrendingUp, ShoppingBag, AlertTriangle, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { DangerZone } from '@/components/admin/DangerZone';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminProductDetail } from '@/api/domains/admin-catalog/queries';

// Removed mock; data fetched via hook

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const { data: product } = useAdminProductDetail(id) as any;

  const stockStatus = product && product.stock > 20 ? 'good' : product && product.stock > 10 ? 'low' : 'critical';

  const handleDeleteClick = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Product?',
      description: 'This will permanently delete this product and all associated data. Customers will no longer be able to purchase this product. This action cannot be undone.',
      confirmText: 'Yes, Delete Product',
      cancelText: 'Cancel',
      itemName: product.name,
    });

    if (confirmed) {
      // TODO: Implement delete product API
      toast.success(`Product "${product.name}" has been deleted`);
      router.push(AdminRoutes.PRODUCTS);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.PRODUCTS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Products
        </Button>
        <Button onClick={() => router.push(AdminRoutes.PRODUCT_EDIT(id))} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Product Details */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Info */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4 sm:space-y-5">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Product Image */}
                  {product?.image ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-primary/20 mx-auto sm:mx-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-primary/20 mx-auto sm:mx-0">
                      <Package className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">{product?.name}</h1>
                        <Badge variant="outline" className="text-xs sm:text-sm">{product?.category}</Badge>
                      </div>
                      <Badge variant={product?.active ? 'default' : 'secondary'} className="text-xs sm:text-sm mx-auto sm:mx-0 w-fit">
                        {product?.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{product?.description}</p>
                  </div>
                </div>

                {/* Price and SKU */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Price</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">₹{product?.price}</p>
                  </div>
                  <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">SKU</p>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{product?.sku || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Performance */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Sales Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Units Sold</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{(product as any)?.sales ?? '-'}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">{(product as any)?.revenue !== undefined ? `₹${(product as any).revenue.toLocaleString()}` : '₹-'}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Reviews</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{(product as any)?.reviewCount ?? (product as any)?.reviews ?? 0}</p>
                </div>

                <div className="p-3 sm:p-3.5 md:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Rating</p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">⭐ {product?.rating ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4 sm:space-y-6">
          {/* Inventory & Quick Stats */}
          <Card className="border-2 border-primary/20 rounded-lg sm:rounded-xl bg-primary/5">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Inventory & Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Stock Status */}
              <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                stockStatus === 'good' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                stockStatus === 'low' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              }`}>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Current Stock</p>
                <p className={`text-2xl sm:text-3xl font-bold ${
                  stockStatus === 'good' ? 'text-green-600 dark:text-green-400' :
                  stockStatus === 'low' ? 'text-orange-600 dark:text-orange-400' :
                  'text-red-600 dark:text-red-400'
                }`}>{product?.stock ?? 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stockStatus === 'good' ? 'Healthy stock level' :
                   stockStatus === 'low' ? 'Low stock - consider reordering' :
                   'Critical - reorder immediately'}
                </p>
              </div>

              {stockStatus !== 'good' && (
                <div className="p-2.5 sm:p-3 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-1.5 sm:gap-2">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-orange-900 dark:text-orange-100">
                    Stock level is {stockStatus}. Update inventory soon.
                  </p>
                </div>
              )}

              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Avg Revenue per Sale</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">₹{product?.price}</p>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-semibold text-foreground flex-shrink-0">12%</span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">94%</span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Repeat Purchases</span>
                  <span className="font-semibold text-foreground flex-shrink-0">38%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DangerZone
            description="Irreversible actions that affect this product"
            actions={[
              {
                title: 'Delete Product',
                description: 'Permanently remove this product from the system',
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
