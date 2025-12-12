'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/admin/Pagination';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Bike, Home, ArrowLeft, Search, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { CustomerRoutes } from '@/lib/constants/routes';
import type { Booking } from '@/types/booking';
import { useBookings } from '@/api/domains/bookings/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

type ServiceOrder = Booking & { _id?: string };

export default function ServiceOrdersPage() {
  const { data: bookingsResponse, isLoading, error, refetch } = useBookings();
  const orders: ServiceOrder[] = bookingsResponse?.data ?? [];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const serviceName = (order.serviceName || '').toLowerCase();
      const orderId = (order.id ?? order._id ?? '').toString().toLowerCase();
      const status = (order.status || '').toLowerCase();

      const matchesSearch = orderId.includes(searchQuery.toLowerCase()) || serviceName.includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination Logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helpers
  const getStatusVariant = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (['delivered', 'completed'].includes(s)) return 'default'; // or 'success' if you have it
    if (['pending', 'processing'].includes(s)) return 'secondary';
    if (['cancelled'].includes(s)) return 'destructive';
    return 'outline';
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('car')) return Car;
    if (name.includes('bike') || name.includes('two wheeler')) return Bike;
    if (name.includes('home')) return Home;
    return Package;
  };

  if (isLoading) return <Loading text="Loading service bookings..." />;

  if (error) {
    return (
      <Error
        message="Failed to load service bookings"
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Simplified Header */}
      <header className="border-b sticky top-0 z-20 bg-background/80 backdrop-blur-md">
        <div className="container-custom py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="-ml-2">
                  <Link href={CustomerRoutes.ORDERS}><ArrowLeft className="h-5 w-5" /></Link>
                </Button>
                Service Orders
              </h1>
              <p className="text-sm text-muted-foreground ml-10">
                Manage and track your service history
              </p>
            </div>

            {/* Moved the Product Orders button here to save space */}
            <Button asChild variant="outline" size="sm" className="ml-10 sm:ml-0 w-fit">
              <Link href={CustomerRoutes.ORDERS_PRODUCTS}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Product Orders
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8 space-y-6">
        {/* Unified Toolbar - Works on Mobile & Desktop */}
        <div className="flex flex-col md:flex-row gap-3 p-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ID or Service Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                title="Clear filters"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Order List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {paginatedOrders.map((order) => {
              const serviceName = (order.serviceName || 'Service Booking');
              const Icon = getServiceIcon(serviceName);
              const date = order.createdAt || order.scheduledAt ? new Date(order.createdAt || order.scheduledAt!).toLocaleDateString() : 'N/A';
              const amount = order.amount || order.totalAmount || 0;
              const orderId = (order.id ?? order._id ?? '').toString();

              return (
                <Card key={orderId} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Icon Column */}
                    <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-muted/50 text-muted-foreground">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between sm:hidden mb-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                      </div>

                      <h3 className="font-semibold truncate">{serviceName}</h3>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="truncate">#{orderId.slice(-6).toUpperCase()}</span>
                        <span>•</span>
                        <span>{date}</span>
                        {order.vehicleDetails && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline truncate capitalize">{order.vehicleDetails.bodyType}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Column (Desktop) */}
                    <div className="hidden sm:block text-right min-w-[100px]">
                      <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                    </div>

                    {/* Price & Action Column */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto">
                      <div className="sm:text-right">
                        <p className="text-xs text-muted-foreground sm:hidden">Total</p>
                        <p className="font-bold text-lg">₹{amount}</p>
                      </div>

                      <Button asChild variant="outline" size="sm" className="h-9">
                        <Link href={CustomerRoutes.ORDER_SERVICE_DETAIL(orderId)}>
                          Details <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              );
            })}

            <div className="pt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No orders found"
            description={hasActiveFilters ? "Try adjusting your filters" : "You haven't booked any services yet."}
            action={!hasActiveFilters ? (
              <Button asChild>
                <Link href={CustomerRoutes.SERVICES}>Book a Service</Link>
              </Button>
            ) : undefined}
          />
        )}
      </main>
    </div>
  );
}
