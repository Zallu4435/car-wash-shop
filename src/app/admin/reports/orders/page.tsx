'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ShoppingBag, IndianRupee, TrendingUp, Package } from 'lucide-react';

export default function OrderReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Product Order Reports</h1>
          <p className="text-muted-foreground mt-1">Detailed product sales analytics</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">189</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">₹56,340</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹298</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">COD Orders</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">45</p>
            <p className="text-sm text-muted-foreground mt-2">
              23.8% of total orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Best Selling Products */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Best Selling Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Car Shampoo', units: 67, revenue: 3350, trend: '+15%' },
              { name: 'Microfiber Cloth', units: 54, revenue: 2700, trend: '+8%' },
              { name: 'Car Wax', units: 43, revenue: 4300, trend: '+22%' },
              { name: 'Tire Cleaner', units: 38, revenue: 1900, trend: '+5%' },
              { name: 'Dashboard Polish', units: 31, revenue: 1550, trend: '+12%' },
            ].map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">₹{product.revenue.toLocaleString()}</p>
                  <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
                    {product.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
