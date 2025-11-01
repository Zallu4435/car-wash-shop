'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/api/domains/orders/queries';
import { useBookings } from '@/api/domains/bookings/queries';
import { Package, Calendar, ChevronRight, ShoppingBag, Car, Clock, ArrowRight, Wrench } from 'lucide-react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { useMemo } from 'react';
import { ROUTES } from '@/lib/constants/routes';

export default function OrdersLandingPage() {
  // API calls - fetch both orders and bookings
  const { data: ordersResponse, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders({ limit: 10 });
  const { data: bookingsResponse, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings();
  
  const isLoading = ordersLoading || bookingsLoading;
  const error = ordersError || bookingsError;
  
  const productOrders = ordersResponse?.data || [];
  const serviceBookings = bookingsResponse?.data || [];
  
  // Combine all orders and bookings
  const allOrders = useMemo(() => {
    const combined = [
      ...productOrders.map(order => ({ ...order, _type: 'order' as const })),
      ...serviceBookings.map(booking => ({ ...booking, _type: 'booking' as const }))
    ];
    return combined.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [productOrders, serviceBookings]);

  const recentOrders = allOrders.slice(0, 3);
  const allServiceOrders = serviceBookings;
  const allProductOrders = productOrders;

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

  const orderCategories = [
    {
      id: 'services',
      title: 'All Services',
      description: 'Car wash, bike service, and home cleaning',
      icon: Car,
      count: allServiceOrders.length,
      color: 'bg-blue-50 dark:bg-blue-950/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      href: ROUTES.CUSTOMER.ORDERS_SERVICES,
    },
    {
      id: 'products',
      title: 'Product Orders',
      description: 'Track your product purchases and deliveries',
      icon: ShoppingBag,
      count: allProductOrders.length,
      color: 'bg-purple-50 dark:bg-purple-950/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      href: ROUTES.CUSTOMER.ORDERS_PRODUCTS,
    },
  ];

  // Loading state
  if (isLoading) {
    return <Loading text="Loading orders..." />;
  }

  // Error state
  if (error) {
    return (
      <Error 
        message="Failed to load orders" 
        details={(error as any)?.message}
        onRetry={() => {
          refetchOrders();
          refetchBookings();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                My Orders
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                Track and manage all your orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {/* Order Categories */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              Browse Orders By Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {orderCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.id} href={category.href}>
                    <Card className="border-2 border-border hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                      <CardContent className="p-5 sm:p-6 md:p-8">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${category.iconColor} group-hover:scale-110 transition-transform`} />
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                          <div>
                            <p className="text-2xl sm:text-3xl font-bold text-foreground">{category.count}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                              {category.count === 1 ? 'order' : 'orders'}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            View All
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4 sm:py-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-background px-3 sm:px-4">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Recent Orders</h2>
              <Button asChild variant="outline" size="sm" className="border-2 w-full sm:w-auto h-9 sm:h-10">
                <Link href={ROUTES.CUSTOMER.ORDERS_ALL} className="text-xs sm:text-sm">View All Orders</Link>
              </Button>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentOrders.map((order) => {
                  const isBooking = (order as any)._type === 'booking';
                  
                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-border">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border">
                          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                            {isBooking ? (
                              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-mono font-bold text-sm sm:text-base text-foreground truncate">
                                {order.id}
                              </p>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                <span className="truncate">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                              <Badge variant="outline" className="mt-1.5 sm:mt-2 text-xs">
                                {isBooking ? 'Service' : 'Product'}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(order.status) as any} className="text-xs sm:text-sm w-fit">
                            {order.status}
                          </Badge>
                        </div>
                        
                        {/* Order Items */}
                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                          <div className="flex justify-between text-xs sm:text-sm gap-2">
                            <span className="text-foreground truncate flex-1">{order.serviceName || 'Order'}</span>
                            <span className="text-muted-foreground flex-shrink-0">× 1</span>
                          </div>
                        </div>

                        {/* Order Footer */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Total Amount</p>
                            <p className="text-xl sm:text-2xl font-bold text-primary">₹{(order as any).amount || order.totalAmount || 0}</p>
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
            ) : (
              <EmptyState
                icon={Package}
                title="No orders yet"
                description="Start shopping to see your orders here"
                action={
                  <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                    <Button asChild className="border-2 w-full sm:w-auto h-10 sm:h-11">
                      <Link href={ROUTES.CUSTOMER.SERVICES} className="text-sm sm:text-base">Browse Services</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-2 w-full sm:w-auto h-10 sm:h-11">
                      <Link href={ROUTES.CUSTOMER.PRODUCTS} className="text-sm sm:text-base">Browse Products</Link>
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
