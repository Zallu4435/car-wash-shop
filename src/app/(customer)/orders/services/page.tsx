'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookings } from '@/api/domains/bookings/queries';
import { VehicleTypeFilter } from '@/components/shared/selectors/VehicleTypeFilter';
import { FilterSheet } from '@/components/shared/filters/FilterSheet';
import { Pagination } from '@/components/admin/Pagination';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Bike, Home, ArrowLeft, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { ROUTES } from '@/lib/constants/routes';

export default function ServiceOrdersPage() {
  const { data: bookingsResponse } = useBookings();
  const orders = bookingsResponse?.data || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const serviceTypes = [
    { id: 'car', name: 'Car', icon: '🚗', count: 0 },
    { id: 'bike', name: 'Bike', icon: '🏍️', count: 0 },
    { id: 'home', name: 'Home', icon: '🏠', count: 0 },
  ];

  const toggleServiceType = (typeId: string) => {
    setSelectedServiceTypes(prev =>
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedServiceTypes([]);
    setCurrentPage(1);
  };

  const allServiceOrders = orders.filter(order => {
    const serviceName = order.serviceName?.toLowerCase() || '';
    return serviceName.includes('wash') ||
      serviceName.includes('service') ||
      serviceName.includes('cleaning') ||
      serviceName.includes('bike') ||
      serviceName.includes('car');
  });

  const filteredOrders = allServiceOrders.filter(order => {
    const serviceName = order.serviceName?.toLowerCase() || '';
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;

    let matchesServiceType = true;
    if (selectedServiceTypes.length > 0) {
      matchesServiceType = selectedServiceTypes.some(type => {
        if (type === 'car') return serviceName.includes('car');
        if (type === 'bike') return serviceName.includes('bike') || serviceName.includes('two wheeler');
        if (type === 'home') return serviceName.includes('home') || serviceName.includes('house') || serviceName.includes('cleaning');
        return false;
      });
    }

    return matchesSearch && matchesStatus && matchesServiceType;
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

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('car')) return Car;
    if (name.includes('bike') || name.includes('two wheeler')) return Bike;
    if (name.includes('home') || name.includes('house') || name.includes('cleaning')) return Home;
    return Package;
  };

  const getServiceColor = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('car')) return { bg: 'bg-blue-50 dark:bg-blue-950/20', text: 'text-blue-600 dark:text-blue-400' };
    if (name.includes('bike')) return { bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-600 dark:text-green-400' };
    if (name.includes('home') || name.includes('cleaning')) return { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400' };
    return { bg: 'bg-primary/10', text: 'text-primary' };
  };

  const activeFiltersCount = [
    selectedServiceTypes.length > 0,
    statusFilter !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, selectedServiceTypes]);

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-3 sm:mb-4 h-9 sm:h-10">
            <Link href={ROUTES.CUSTOMER.ORDERS}>
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Orders</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                All Services
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                {filteredOrders.length} service {filteredOrders.length === 1 ? 'booking' : 'bookings'}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="border-2 mt-3 sm:mt-4 h-9 sm:h-10" size="sm">
            <Link href={ROUTES.CUSTOMER.ORDERS_PRODUCTS} className="text-xs sm:text-sm">
              <ShoppingBag className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              View Product Orders
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {/* Desktop Filters */}
          <div className="hidden lg:block space-y-6 mb-6">
            {/* Service Type Tabs */}
            <Card className="border-2 border-border">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <Tabs value={selectedServiceTypes[0] || 'all'} onValueChange={(value) => setSelectedServiceTypes(value === 'all' ? [] : [value])} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-auto gap-2">
                    <TabsTrigger value="all" className="border-2 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                      All Services
                    </TabsTrigger>
                    {serviceTypes.map((type) => (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="border-2 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                      >
                        {type.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

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
                      placeholder="Search by order ID or service name..."
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
                {paginatedOrders.map((order) => {
                const ServiceIcon = getServiceIcon(order.serviceName);
                const colors = getServiceColor(order.serviceName);

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                          <ServiceIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.text} flex-shrink-0`} />
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
                        {order.vehicleDetails && (
                          <div className="text-xs text-muted-foreground">
                            {order.vehicleDetails.model} • {order.vehicleDetails.number}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-primary">₹{order.amount || order.totalAmount || 0}</p>
                        </div>
                        <Button asChild variant="outline" className="border-2 group w-full sm:w-auto h-9 sm:h-10" size="sm">
                          <Link href={`${ROUTES.CUSTOMER.ORDERS}/${order.id}`} className="text-xs sm:text-sm">
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
              title="No service bookings found"
              description={searchQuery || statusFilter !== 'all' || selectedServiceTypes.length > 0
                ? 'Try adjusting your filters'
                : 'Book a service to see your orders here'}
              action={
                <Button asChild size="lg" className="border-2 h-10 sm:h-11">
                  <Link href={ROUTES.CUSTOMER.SERVICES} className="text-sm sm:text-base">Browse Services</Link>
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
        {/* Service Type Filter */}
        <VehicleTypeFilter
          vehicleTypes={serviceTypes}
          selectedTypes={selectedServiceTypes}
          onToggle={toggleServiceType}
          onClearAll={() => setSelectedServiceTypes([])}
        />

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
