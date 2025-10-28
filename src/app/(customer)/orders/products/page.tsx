'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMockData } from '@/lib/api/mockData';
import { Package, Calendar, ChevronRight, Car, ArrowLeft, Search, Filter, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductOrdersPage() {
  const orders = getMockData.orders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Prevent body scroll when filter modal is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  const productOrders = orders.filter(order => 
    order.items.some(item => 
      !item.name.toLowerCase().includes('wash') && 
      !item.name.toLowerCase().includes('service') &&
      !item.name.toLowerCase().includes('cleaning')
    )
  );

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

  const activeFiltersCount = [
    statusFilter !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-purple-500/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-3 sm:mb-4 h-9 sm:h-10">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Orders</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                Product Orders
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                {filteredOrders.length} product {filteredOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="mt-3 sm:mt-4 h-9 sm:h-10" size="sm">
            <Link href="/orders/services" className="text-xs sm:text-sm">
              <Car className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              View Service Orders
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {/* Desktop Filters */}
          <Card className="hidden lg:block mb-6 border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filters</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex-shrink-0">
                          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono font-bold text-sm sm:text-base text-foreground truncate">
                            {order.id}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">{order.orderDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(order.status) as any} className="text-xs sm:text-sm w-fit">
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs sm:text-sm gap-2">
                          <span className="text-foreground truncate flex-1">{item.name}</span>
                          <span className="text-muted-foreground flex-shrink-0">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Total Amount</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">₹{order.total}</p>
                      </div>
                      <Button asChild variant="outline" className="group w-full sm:w-auto h-9 sm:h-10" size="sm">
                        <Link href={`/orders/${order.id}`} className="text-xs sm:text-sm">
                          View Details
                          <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-full mb-4 sm:mb-6 shadow-sm">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                No product orders found
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Shop products to see your orders here'}
              </p>
              <Button asChild size="lg" className="h-10 sm:h-11">
                <Link href="/products" className="text-sm sm:text-base">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Bottom Filter Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-background/95 backdrop-blur-xl border-t border-border shadow-lg px-4 py-3">
          <Button
            variant="default"
            size="lg"
            className="w-full shadow-md h-12 text-sm sm:text-base font-semibold"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-accent text-accent-foreground font-bold text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl border-t-2 border-border max-h-[88vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Filters</h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredOrders.length} result{filteredOrders.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                className="rounded-full h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Status</h3>
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
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-semibold text-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 h-11 font-semibold text-sm shadow-md"
                  onClick={() => setShowFilters(false)}
                >
                  Show {filteredOrders.length} Result{filteredOrders.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
