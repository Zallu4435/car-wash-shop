'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Package, IndianRupee, TrendingUp, ShoppingBag, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

const product = {
  id: 'prod_001',
  name: 'Premium Car Shampoo',
  category: 'Cleaning Products',
  description: 'Professional grade car shampoo with advanced cleaning formula. pH balanced and safe for all paint types. Creates rich foam for effective dirt removal.',
  price: 299,
  stock: 50,
  active: true,
  image: '',
  sku: 'CS-PREM-001',
  sales: 234,
  revenue: 69966,
  reviews: 45,
  rating: 4.7,
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const deleteConfirmation = useConfirmation();

  const stockStatus = product.stock > 20 ? 'good' : product.stock > 10 ? 'low' : 'critical';

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
      router.push('/admin/products');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/products')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <Button onClick={() => router.push(`/admin/products/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-border">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4">{product.description}</p>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">SKU</p>
                      <p className="font-mono font-semibold text-foreground">{product.sku}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Performance */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Sales Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Units Sold</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{product.sales}</p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <p className="text-xs text-green-900 dark:text-green-100 uppercase tracking-wide">Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">₹{product.revenue.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Rating</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">⭐ {product.rating}</p>
                  <p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Inventory */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Inventory</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-xl border-2 ${
                stockStatus === 'good' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                stockStatus === 'low' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' :
                'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              }`}>
                <p className="text-xs text-muted-foreground mb-1">Current Stock</p>
                <p className={`text-4xl font-bold ${
                  stockStatus === 'good' ? 'text-green-600 dark:text-green-400' :
                  stockStatus === 'low' ? 'text-orange-600 dark:text-orange-400' :
                  'text-red-600 dark:text-red-400'
                }`}>{product.stock}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stockStatus === 'good' ? 'Healthy stock level' :
                   stockStatus === 'low' ? 'Low stock - consider reordering' :
                   'Critical - reorder immediately'}
                </p>
              </div>

              {stockStatus !== 'good' && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    Stock level is {stockStatus}. Update inventory soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-lg">Danger Zone</CardTitle>
              <p className="text-sm text-muted-foreground">
                Irreversible actions that affect this product
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-foreground">Delete Product</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove this product from the system
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
