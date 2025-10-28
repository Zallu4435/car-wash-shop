'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingBag, 
  Search, 
  Eye,
  IndianRupee,
  Package,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { getMockData } from '@/lib/api/mockData';

export default function OrdersPage() {
  const router = useRouter();
  const orders = getMockData.orders();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const statusColors = {
    processing: { variant: 'secondary' as const, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-950/30' },
    confirmed: { variant: 'default' as const, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' },
    shipped: { variant: 'default' as const, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-950/30' },
    delivered: { variant: 'default' as const, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' },
    cancelled: { variant: 'secondary' as const, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-950/30' },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Product Orders
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage product orders and delivery status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Orders</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{orders.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Revenue</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Delivered</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{deliveredOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          {/* Orders Grid */}
          <div className="space-y-2.5 sm:space-y-3">
            {filteredOrders.map((order) => {
              const statusStyle = statusColors[order.status as keyof typeof statusColors] || statusColors.processing;
              return (
                <Card key={order.id} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {order.id}
                            </Badge>
                            <Badge className={`${statusStyle.bgColor} text-xs capitalize`}>
                              <span className={statusStyle.color}>{order.status}</span>
                            </Badge>
                          </div>
                          <p className="font-semibold text-foreground truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {order.orderDate}
                          </p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Amount</p>
                          <p className="text-xl font-bold text-primary">₹{order.total}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="h-9 text-xs sm:text-sm"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {order.id}
                            </Badge>
                            <Badge className={`${statusStyle.bgColor} text-xs capitalize`}>
                              <span className={statusStyle.color}>{order.status}</span>
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {order.orderDate}
                          </p>
                          <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Amount</p>
                              <p className="text-lg sm:text-xl font-bold text-primary">₹{order.total}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="w-full h-9 text-xs sm:text-sm"
                      >
                        <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
