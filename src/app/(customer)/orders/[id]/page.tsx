'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Package, MapPin, CreditCard, Calendar, FileText, XCircle, Wrench, Star, Edit } from 'lucide-react';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/api/domains/orders/queries';
import { useBooking } from '@/api/domains/bookings/queries';
import { useReviewByOrder, useReviewByBooking, useReviewsByProduct, useReviewsByService } from '@/api/domains/reviews/queries';
import { ReviewModal } from '@/components/customer/ReviewModal';
import { ReviewsList } from '@/components/customer/ReviewsList';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Determine if it's a booking based on ID prefix
  const isBookingId = id.startsWith('booking_');
  
  // Fetch based on ID type
  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(id);
  const { data: booking, isLoading: bookingLoading } = useBooking(id);
  
  // Fetch existing review
  const { data: orderReview } = useReviewByOrder(id);
  const { data: bookingReview } = useReviewByBooking(id);

  // Determine which data to use
  const isService = isBookingId ? true : (booking && !order);
  const data = isService ? booking : order;
  const isLoading = orderLoading || bookingLoading;
  const existingReview = isService ? bookingReview : orderReview;
  
  // Check if order/booking is completed
  const isCompleted = (data as any)?.status?.toLowerCase() === 'completed' || (data as any)?.status?.toLowerCase() === 'delivered';
  
  // Fetch all reviews for the product/service
  const productId = !isService ? (data as any)?.items?.[0]?.productId || 'product_001' : undefined;
  const serviceId = isService ? (data as any)?.serviceId || 'service_001' : undefined;
  
  const { data: productReviews = [] } = useReviewsByProduct(productId || 'product_001');
  const { data: serviceReviews = [] } = useReviewsByService(serviceId || 'service_001');
  
  const allReviews = isService ? serviceReviews : productReviews;
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
    : 0;

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
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header Section */}
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container-custom py-4 sm:py-6">
          <Link href={CustomerRoutes.ORDERS}>
            <Button variant="ghost" className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {isService ? (
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Wrench className="h-6 w-6" />
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isService ? 'Service Booking Details' : 'Order Details'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isService ? 'Booking' : 'Order'} #{id}
              </p>
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
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Order Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl">
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
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
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
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
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
                <Card className="border-2 border-border">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
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

              {/* Review Section - Show if completed */}
              {isCompleted && (
                <Card className="border-2 border-border bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                          {existingReview ? 'Your Review' : 'Rate Your Experience'}
                        </h3>
                        {existingReview ? (
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    star <= existingReview.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm sm:text-base font-medium text-foreground ml-1">
                                {existingReview.rating}.0
                              </span>
                            </div>
                            {existingReview.comment && (
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {existingReview.comment}
                              </p>
                            )}
                            <Button
                              onClick={() => setShowReviewModal(true)}
                              variant="outline"
                              size="sm"
                              className="mt-2 h-9 text-xs sm:text-sm border-2"
                            >
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit Review
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              Share your experience to help others and improve our service
                            </p>
                            <Button
                              onClick={() => setShowReviewModal(true)}
                              className="h-10 sm:h-11 shadow-lg text-xs sm:text-sm border-2"
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Write a Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isService && (
                  <Button asChild variant="outline" className="flex-1 h-10 sm:h-11">
                    <Link href={CustomerRoutes.ORDER_INVOICE(id)} className="text-xs sm:text-sm">
                      <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Download Invoice
                    </Link>
                  </Button>
                )}
                {!isCompleted && (
                  <Button 
                    asChild 
                    variant="outline" 
                    className={`${!isService ? 'flex-1' : 'w-full'} h-10 sm:h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20`}
                  >
                    <Link href={CustomerRoutes.ORDER_CANCEL(id)} className="text-xs sm:text-sm">
                      <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {isService ? 'Cancel Booking' : 'Cancel Order'}
                    </Link>
                  </Button>
                )}
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

          {/* Customer Reviews Section - Full Width */}
          <div className="mt-6 sm:mt-8">
            <ReviewsList
              reviews={allReviews}
              averageRating={averageRating}
              totalReviews={allReviews.length}
              productName={!isService ? (data as any)?.items?.[0]?.productName : undefined}
              serviceName={isService ? (data as any)?.serviceName : undefined}
            />
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={!isService ? id : undefined}
        bookingId={isService ? id : undefined}
        productId={!isService ? (data as any)?.items?.[0]?.productId : undefined}
        serviceId={isService ? (data as any)?.serviceId : undefined}
        itemName={isService ? (data as any)?.serviceName || 'Service' : (data as any)?.items?.[0]?.productName || 'Order'}
        isService={isService}
        existingReview={existingReview}
      />
    </div>
  );
}
