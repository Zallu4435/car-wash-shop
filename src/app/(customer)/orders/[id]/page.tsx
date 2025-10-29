'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Package, MapPin, CreditCard, Calendar, FileText, XCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/api/domains/orders/queries';
import { useBooking } from '@/api/domains/bookings/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Determine if it's a booking based on ID prefix
  const isBookingId = id.startsWith('booking_');
  
  // Fetch based on ID type
  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(id);
  const { data: booking, isLoading: bookingLoading } = useBooking(id);

  // Determine which data to use
  const isService = isBookingId ? true : (booking && !order);
  const data = isService ? booking : order;
  const isLoading = orderLoading || bookingLoading;

  if (isLoading) {
    return <Loading text="Loading details..." />;
  }

  if (!data) {
    return <Error message={isService ? "Booking not found" : "Order not found"} onRetry={() => window.location.reload()} />;
  }

  // Map booking status to order status for tracker
  const getTrackerStatus = () => {
    if (isService) {
      const status = (data as any).status?.toLowerCase();
      if (status === 'completed') return 'delivered';
      if (status === 'in_progress') return 'shipped';
      if (status === 'confirmed') return 'confirmed';
      return 'processing';
    }
    return (data as any).status || 'processing';
  };

  const statusHistory = [
    { status: 'processing', timestamp: new Date(data.createdAt || Date.now()).toLocaleString(), label: isService ? 'Booking Placed' : 'Order Placed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-5 sm:py-6 md:py-8">
          <Link href="/orders">
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Orders</span>
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                {isService ? (
                  <Wrench className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                ) : (
                  <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  {isService ? 'Service Booking Details' : 'Order Details'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  {isService ? 'Booking' : 'Order'} #{id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Information */}
              <Card className="border-2">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Order Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Order Date</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {new Date(data.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Payment Method</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {(data as any).paymentMethod || (data as any).paymentStatus || 'Online Payment'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="border-2">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{isService ? 'Service Details' : 'Order Items'}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {isService ? (
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {(data as any).serviceName || 'Service Booking'}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                            Scheduled: {(data as any).scheduledDate} at {(data as any).scheduledTime}
                          </p>
                          <p className="text-base sm:text-lg font-bold text-primary mt-1 sm:mt-2">₹{(data as any).amount || (data as any).totalAmount}</p>
                        </div>
                      </div>
                    ) : (
                      (data as any).items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                              {item.productName || item.name || 'Product'}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Quantity: {item.quantity}</p>
                            <p className="text-base sm:text-lg font-bold text-primary mt-1 sm:mt-2">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      )) || (
                        <div className="p-4 text-center text-muted-foreground">No items found</div>
                      )
                    )}
                  </div>

                  <Separator className="my-3 sm:my-4" />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹{(data as any).subtotal || (data as any).amount || (data as any).totalAmount || 0}</span>
                    </div>
                    {(data as any).discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-green-600 dark:text-green-400">Discount</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-₹{(data as any).discount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-base sm:text-lg text-foreground">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-primary">₹{(data as any).total || (data as any).amount || (data as any).totalAmount || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Location / Delivery Address */}
              <Card className="border-2">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">
                      {isService ? 'Service Location' : 'Delivery Address'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {(data as any).address || (data as any).deliveryAddress || 'Address not available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Vehicle Details - Only for Services */}
              {isService && (data as any).vehicleDetails && (
                <Card className="border-2">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">Vehicle Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vehicle Type</span>
                        <span className="font-medium text-foreground capitalize">
                          {(data as any).vehicleDetails.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium text-foreground">
                          {(data as any).vehicleDetails.make} {(data as any).vehicleDetails.model}
                        </span>
                      </div>
                      {(data as any).vehicleDetails.number && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Number</span>
                          <span className="font-medium text-foreground">
                            {(data as any).vehicleDetails.number}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isService && (
                  <Button asChild variant="outline" className="flex-1 h-10 sm:h-11">
                    <Link href={`/orders/${id}/invoice`} className="text-xs sm:text-sm">
                      <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Download Invoice
                    </Link>
                  </Button>
                )}
                <Button 
                  asChild 
                  variant="outline" 
                  className={`${!isService ? 'flex-1' : 'w-full'} h-10 sm:h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20`}
                >
                  <Link href={`/orders/${id}/cancel`} className="text-xs sm:text-sm">
                    <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {isService ? 'Cancel Booking' : 'Cancel Order'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Order Tracker */}
            <div className="lg:col-span-1">
              <OrderTracker
                currentStatus={getTrackerStatus()}
                statusHistory={statusHistory}
                isService={isService}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
