'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMockData } from '@/lib/api/mockData';
import { Package, Calendar, ChevronRight, Car, ArrowLeft, Search, Filter, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ProductOrdersPage() {
  const orders = getMockData.orders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter product orders
  const productOrders = orders.filter(order => 
    order.items.some(item => 
      !item.name.toLowerCase().includes('wash') && 
      !item.name.toLowerCase().includes('service') &&
      !item.name.toLowerCase().includes('cleaning')
    )
  );

  // Apply filters
  const filteredOrders = productOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'default';
      case 'pending':
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-500/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Product Orders</h1>
              <p className="text-muted-foreground mt-1">
                {filteredOrders.length} product {filteredOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>

          {/* Quick Link */}
          <Button asChild variant="outline" className="mt-4" size="sm">
            <Link href="/orders/services">
              <Car className="mr-2 h-4 w-4" />
              View Service Orders
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          {/* Search and Filters */}
          <Card className="mb-6 border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-foreground">{order.id}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{order.orderDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4 p-4 bg-muted rounded-xl">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                      </div>
                      <Button asChild variant="outline" className="group">
                        <Link href={`/orders/${order.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-background rounded-full mb-6 shadow-sm">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No product orders found</h2>
              <p className="text-muted-foreground mb-8">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Shop products to see your orders here'}
              </p>
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
