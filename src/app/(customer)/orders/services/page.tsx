'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/api/domains/orders/queries';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Bike, Home, ArrowLeft, Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { mockServiceTypes } from '@/mocks/data/customer-mock-data';

export default function ServiceOrdersPage() {
  const { data: ordersResponse } = useOrders({ type: 'service' });
  const orders = ordersResponse?.data || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const serviceTypes = [
    { id: 'all', name: 'All Services', icon: Package },
    ...mockServiceTypes.map(type => ({
      id: type.id,
      name: type.name,
      icon: type.icon === 'Car' ? Car : Bike,
    })),
  ];

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
    if (serviceTypeFilter !== 'all') {
      if (serviceTypeFilter === 'car') {
        matchesServiceType = serviceName.includes('car');
      } else if (serviceTypeFilter === 'bike') {
        matchesServiceType = serviceName.includes('bike') || serviceName.includes('two wheeler');
      } else if (serviceTypeFilter === 'home') {
        matchesServiceType = serviceName.includes('home') || serviceName.includes('house') || serviceName.includes('cleaning');
      }
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
    serviceTypeFilter !== 'all',
    statusFilter !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-blue-500/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button asChild variant="ghost" className="mb-3 sm:mb-4 h-9 sm:h-10">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Orders</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                All Services
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                {filteredOrders.length} service {filteredOrders.length === 1 ? 'booking' : 'bookings'}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="mt-3 sm:mt-4 h-9 sm:h-10" size="sm">
            <Link href="/orders/products" className="text-xs sm:text-sm">
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
              <CardContent className="p-6">
                <Tabs value={serviceTypeFilter} onValueChange={setServiceTypeFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-auto gap-2">
                    {serviceTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <TabsTrigger
                          key={type.id}
                          value={type.id}
                          className="flex items-center gap-2 py-3"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{type.name}</span>
                        </TabsTrigger>
                      );
                    })}
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
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => {
                const ServiceIcon = getServiceIcon(order.serviceName);
                const colors = getServiceColor(order.serviceName);

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`p-1.5 sm:p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
                            <ServiceIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.text}`} />
                          </div>
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
                          <p className="text-xl sm:text-2xl font-bold text-primary">₹{order.totalAmount}</p>
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
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No service bookings found"
              description={searchQuery || statusFilter !== 'all' || serviceTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Book a service to see your orders here'}
              action={
                <Button asChild size="lg" className="h-10 sm:h-11">
                  <Link href="/services" className="text-sm sm:text-base">Browse Services</Link>
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
              {/* Service Type Tabs */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-foreground">Service Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = serviceTypeFilter === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setServiceTypeFilter(type.id)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-medium">{type.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    setServiceTypeFilter('all');
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
