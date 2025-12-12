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
import { useBookings } from '@/api/domains/bookings/queries';
import { Package, Calendar, ChevronRight, ShoppingBag, ArrowLeft, Search, Filter, X, SlidersHorizontal, Wrench } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { ComponentProps } from 'react';
import Loading from '@/components/shared/display/Loading';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { CustomerRoutes } from '@/lib/constants/routes';
import type { Order as ProductOrder } from '@/types/order';
import type { Booking } from '@/types/booking';

type MixedOrder = (ProductOrder & { _type: 'order' }) | (Booking & { _type: 'booking' });

export default function AllOrdersPage() {
  // Fetch both orders and bookings
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders();
  const { data: bookingsResponse, isLoading: bookingsLoading } = useBookings();

  // State hooks MUST be called before any conditional returns
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allOrders = useMemo<MixedOrder[]>(() => {
    const productOrders = ordersResponse?.data ?? [];
    const serviceBookings = bookingsResponse?.data ?? [];

    const combined: MixedOrder[] = [
      ...productOrders.map(order => ({ ...order, _type: 'order' as const })),
      ...serviceBookings.map(booking => ({ ...booking, _type: 'booking' as const })),
    ];

    return combined.sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [ordersResponse?.data, bookingsResponse?.data]);

  const orders = allOrders;

  // Prevent body scroll when modal is open - MUST be before conditional return
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  // Check loading state AFTER all hooks
  const isLoading = ordersLoading || bookingsLoading;
  if (isLoading) { return <Loading text="Loading orders..." /> }

  const filteredOrders = orders.filter(order => {
    const isBooking = order._type === 'booking';
    const normalizedSearch = searchQuery.toLowerCase();
    const normalizedStatus = (order.status || '').toLowerCase();
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;

    let matchesType = true;
    if (typeFilter === 'services') {
      matchesType = isBooking;
    } else if (typeFilter === 'products') {
      matchesType = !isBooking;
    }

    const baseId = (order.id || '').toString().toLowerCase();
    let matchesSearch = true;
    if (normalizedSearch) {
      if (isBooking) {
        const serviceName = (order.serviceName || '').toLowerCase();
        matchesSearch =
          baseId.includes(normalizedSearch) ||
          serviceName.includes(normalizedSearch);
      } else {
        const orderNumber = (order.orderNumber || '').toLowerCase();
        const items = order.items ?? [];
        const itemMatch = items.some(item =>
          (item.productName || '').toLowerCase().includes(normalizedSearch)
        );
        matchesSearch =
          orderNumber.includes(normalizedSearch) ||
          baseId.includes(normalizedSearch) ||
          itemMatch;
      }
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handleFilterChange = (filterSetter: (value: string) => void, value: string) => {
    filterSetter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all';
  const activeFiltersCount = [
    typeFilter !== 'all',
    statusFilter !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  type BadgeVariant = ComponentProps<typeof Badge>['variant'];
  const getStatusVariant = (status: string): BadgeVariant => {
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
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {/* Desktop Filters */}
          <Card className="mb-6 border-2 border-border hidden lg:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(value) => handleFilterChange(setTypeFilter, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(value) => handleFilterChange(setStatusFilter, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
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
          {paginatedOrders.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {paginatedOrders.map((order) => {
                  const isBooking = order._type === 'booking';
                  const bookingData = isBooking ? order : null;
                  const productData = !isBooking ? order : null;

                  const detailHref = isBooking
                    ? CustomerRoutes.ORDER_SERVICE_DETAIL(order.id)
                    : CustomerRoutes.ORDER_PRODUCT_DETAIL(order.id);
                  const primaryLabel = isBooking
                    ? bookingData?.serviceName || 'Service Booking'
                    : (productData?.items?.[0]?.productName ?? 'Product Order');
                  const amountValue = isBooking
                    ? bookingData?.amount ?? bookingData?.totalAmount ?? 0
                    : productData?.totalAmount ?? productData?.subtotal ?? 0;
                  const orderIdentifier = isBooking
                    ? order.id
                    : order.orderNumber || order.id;
                  const additionalItems = !isBooking
                    ? Math.max(((productData?.items?.length) ?? 0) - 1, 0)
                    : 0;
                  const displayDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : 'Date unavailable';
                  const productQuantity = !isBooking
                    ? productData?.items?.[0]?.quantity ?? 1
                    : 1;

                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                            {isBooking ? (
                              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-mono font-bold text-sm sm:text-base text-foreground truncate">
                                {orderIdentifier}
                              </p>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="truncate">{displayDate}</span>
                              </div>
                              <Badge variant="outline" className="mt-1.5 sm:mt-2 text-xs">
                                {isBooking ? 'Service Booking' : 'Product Order'}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(order.status)} className="text-xs sm:text-sm w-fit">
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                          <div className="flex justify-between text-xs sm:text-sm gap-2">
                            <span className="text-foreground truncate flex-1">{primaryLabel}</span>
                            <span className="text-muted-foreground flex-shrink-0">
                              × {productQuantity}
                            </span>
                          </div>
                          {!isBooking && additionalItems > 0 && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                              + {additionalItems} more item{additionalItems > 1 ? 's' : ''}
                            </p>
                          )}
                          {isBooking && order.vehicleDetails && (
                            <div className="text-xs text-muted-foreground">
                              <span className="capitalize">{order.vehicleDetails.bodyType}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Total Amount</p>
                            <p className="text-xl sm:text-2xl font-bold text-primary">₹{amountValue}</p>
                          </div>
                          <Button asChild variant="outline" className="group w-full sm:w-auto h-9 sm:h-10" size="sm">
                            <Link href={detailHref} className="text-xs sm:text-sm">
                              View Details
                              <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
              title="No orders found"
              description={hasActiveFilters
                ? 'Try adjusting your filters to find what you\'re looking for'
                : 'Start shopping to see your orders here'}
              action={
                hasActiveFilters ? (
                  <Button onClick={clearFilters} className="h-10 sm:h-11">Clear Filters</Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                    <Button asChild className="h-10 sm:h-11">
                      <Link href={CustomerRoutes.SERVICES} className="text-sm sm:text-base">Browse Services</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-10 sm:h-11">
                      <Link href={CustomerRoutes.PRODUCTS} className="text-sm sm:text-base">Browse Products</Link>
                    </Button>
                  </div>
                )
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
            onClick={() => setShowMobileFilters(true)}
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
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
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

        {/* Order Type */}
        <div>
          <h3 className="font-semibold text-sm mb-3 text-foreground">Order Type</h3>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="products">Products</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="font-semibold text-sm mb-3 text-foreground">Status</h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
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
