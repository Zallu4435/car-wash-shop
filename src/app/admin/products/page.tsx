'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Plus, 
  Search, 
  Eye, 
  Edit,
  Trash2,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    id: 'prod_001',
    name: 'Premium Car Shampoo',
    category: 'Cleaning Products',
    price: 299,
    stock: 50,
    active: true,
  },
  {
    id: 'prod_002',
    name: 'Microfiber Cloth Set',
    category: 'Cleaning Products',
    price: 199,
    stock: 100,
    active: true,
  },
  {
    id: 'prod_003',
    name: 'Car Wax Polish',
    category: 'Car Care',
    price: 549,
    stock: 30,
    active: true,
  },
  {
    id: 'prod_004',
    name: 'Tire Shine Spray',
    category: 'Car Care',
    price: 249,
    stock: 3,
    active: true,
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock <= 10) ||
      (stockFilter === 'good' && p.stock > 10);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockItems = products.filter(p => p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}>
                <Package className="h-6 w-6" style={{ color: 'hsl(221 83% 53%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{products.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}>
                <TrendingUp className="h-6 w-6" style={{ color: 'hsl(160 60% 45%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              ₹{totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(280 65% 60% / 0.1)' }}>
                <Package className="h-6 w-6" style={{ color: 'hsl(280 65% 60%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(30 80% 55% / 0.1)' }}>
                <AlertTriangle className="h-6 w-6" style={{ color: 'hsl(30 80% 55%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(30 80% 55%)' }}>
              {lowStockItems}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <Package className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle>All Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c !== 'all').map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="good">Good Stock (&gt;10)</SelectItem>
                <SelectItem value="low">Low Stock (≤10)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStockFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = product.stock > 10 ? 'good' : product.stock > 0 ? 'low' : 'out';
                return (
                  <Card key={product.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <Package className="h-6 w-6" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{product.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>
                          </div>
                        </div>
                        <Badge variant={product.active ? 'default' : 'secondary'}>
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-muted rounded-lg border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Price</p>
                          </div>
                          <p className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>
                            ₹{product.price}
                          </p>
                        </div>
                        <div 
                          className="p-3 rounded-lg border"
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
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Stock</p>
                          </div>
                          <p 
                            className="text-lg font-bold"
                            style={{
                              color: stockStatus === 'good'
                                ? 'hsl(160 60% 45%)'
                                : stockStatus === 'low'
                                ? 'hsl(30 80% 55%)'
                                : 'hsl(0 63% 55%)'
                            }}
                          >
                            {product.stock} units
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ color: 'hsl(0 63% 55%)' }}
                          className="hover:bg-destructive/10 border-border"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
