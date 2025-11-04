'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/admin/Pagination';
import { FilterSheet } from '@/components/shared/filters/FilterSheet';
import { useOrders } from '@/api/domains/orders/queries';
import { Package, Calendar, ChevronRight, Car, ArrowLeft, Search, Filter, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function ProductOrdersPage() {
  const { data: ordersResponse } = useOrders({ type: 'product' });
  const orders = ordersResponse?.data || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const productOrders = orders.filter(order => {
    const serviceName = order.serviceName?.toLowerCase() || '';
    return !serviceName.includes('wash') && 
      !serviceName.includes('service') &&
      !serviceName.includes('cleaning') &&
      !serviceName.includes('bike') &&
      !serviceName.includes('car');
  });

  const filteredOrders = productOrders.filter(order => {
    const serviceName = order.serviceName?.toLowerCase() || '';
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
      {/* Header Section */}
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container-custom py-4 sm:py-6">
          <Button asChild variant="ghost" className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors">
            <Link href={CustomerRoutes.ORDERS}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Product Orders</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredOrders.length} product {filteredOrders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Button */}
      <section className="border-b border-border bg-muted/30">
        <div className="container-custom py-3">
          <Button asChild variant="outline" className="border-2 h-9" size="sm">
            <Link href={CustomerRoutes.ORDERS_SERVICES} className="text-xs sm:text-sm">
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
          <div className="hidden lg:block space-y-6 mb-6">
            {/* Search and Filters */}
            <Card className="border-2 border-border">
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
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4">
                {paginatedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono font-bold text-sm sm:text-base text-foreground truncate">
                            {order.id}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                            <span className="truncate">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(order.status) as any} className="text-xs sm:text-sm w-fit">
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <div className="flex justify-between text-xs sm:text-sm gap-2">
                        <span className="text-foreground truncate flex-1">{order.serviceName}</span>
                        <span className="text-muted-foreground flex-shrink-0">× 1</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Total Amount</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                      </div>
                      <Button asChild variant="outline" className="border-2 group w-full sm:w-auto h-9 sm:h-10" size="sm">
                        <Link href={CustomerRoutes.ORDER_DETAIL(order.id)} className="text-xs sm:text-sm">
                          View Details
                          <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="No product orders found"
              description={searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Shop products to see your orders here'}
              action={
                <Button asChild size="lg" className="border-2 h-10 sm:h-11">
                  <Link href={CustomerRoutes.PRODUCTS} className="text-sm sm:text-base">Browse Products</Link>
                </Button>
              }
            />
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
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onClearAll={handleClearAllFilters}
        resultCount={filteredOrders.length}
      >
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
      </FilterSheet>
    </div>
  );
}
