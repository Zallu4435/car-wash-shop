'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  FileText,
  XCircle,
  Star,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/api/domains/orders/queries';
import { useReviewByOrder } from '@/api/domains/reviews/queries';
import { useComplaintByReference, useCanFileComplaint } from '@/api/domains/complaints/queries';
import { ReviewModal } from '@/components/customer/ReviewModal';
import { ComplaintModal } from '@/components/customer/ComplaintModal';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { COMPLAINT_CATEGORY_LABELS } from '@/types/complaint';

export default function ProductOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const {
    data: order,
    isLoading,
    error
  } = useOrder(id);

  const { data: orderReview } = useReviewByOrder(id);
  const { data: existingComplaint } = useComplaintByReference('productOrder', id);
  const { data: canFileData } = useCanFileComplaint('productOrder', id);
  const productId = order?.items?.[0]?.productId;

  const normalizedStatus = (order?.status || '').toLowerCase();
  const isCompleted = ['completed', 'delivered'].includes(normalizedStatus);
  const isCancelRestricted = ['packed', 'shipped', 'out-for-delivery', 'delivered', 'returned', 'cancelled'].includes(
    normalizedStatus
  );
  const canCancelOrder = Boolean(order && !isCancelRestricted);

  if (isLoading) {
    return <Loading text="Loading order details..." />;
  }

  if (!order || error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message?: string }).message)
        : undefined;
    return <Error message="Order not found" details={errorMessage} />;
  }

  const trackerStatus = order.status || 'processing';
  const createdAtDate = order.createdAt ? new Date(order.createdAt) : null;
  const statusHistory = [
    {
      status: 'processing',
      timestamp: createdAtDate ? createdAtDate.toLocaleString() : 'Date unavailable',
      label: 'Order Placed',
    },
  ];

  const subtotal = order.subtotal ?? order.totalAmount ?? 0;
  const discount = order.discount ?? 0;
  const total = order.total ?? order.totalAmount ?? subtotal - discount;
  const formattedAddress = (() => {
    const addr = order.deliveryAddress;
    if (!addr) return 'Address not available';
    if (typeof addr === 'string') return addr;
    const parts = [
      addr.line1,
      addr.line2,
      [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
      addr.landmark,
      addr.phone ? `Phone: ${addr.phone}` : null,
    ].filter(Boolean);
    return parts.join('\n');
  })();



  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container-custom py-4 sm:py-6">
          <Link href={CustomerRoutes.ORDERS}>
            <Button variant="ghost" className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Order #{id}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
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
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'Date unavailable'}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Payment Method</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {order.paymentMethod || order.paymentStatus || 'Online Payment'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Order Items</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items?.length ? (
                      order.items.map((item, index: number) => {
                        const quantity = item.quantity ?? 1;
                        const unitPrice = item.price ?? item.unitPrice ?? 0;
                        const lineTotal = item.subtotal ?? unitPrice * quantity;
                        return (
                          <div key={`${item.productId}-${index}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                {item.productName || item.name || 'Product'}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                                Quantity: {quantity}
                              </p>
                              <p className="text-base sm:text-lg font-bold text-primary mt-1 sm:mt-2">₹{lineTotal}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No items available</div>
                    )}
                  </div>

                  <Separator className="my-3 sm:my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-green-600 dark:text-green-400">Discount</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-₹{discount}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-base sm:text-lg text-foreground">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-primary">₹{total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Delivery Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {formattedAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {isCompleted && (
                <Card className="border-2 border-border bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                          {orderReview ? 'Your Review' : 'Rate Your Experience'}
                        </h3>
                        {orderReview ? (
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${star <= orderReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                              ))}
                              <span className="text-sm sm:text-base font-medium text-foreground ml-1">
                                {orderReview.rating}.0
                              </span>
                            </div>
                            {orderReview.comment && (
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {orderReview.comment}
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

              {/* Complaint Section */}
              {isCompleted && (
                <Card className="border-2 border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {existingComplaint ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground">
                                Your Complaint
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${existingComplaint.status === 'resolved'
                                  ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20'
                                  : existingComplaint.status === 'in_progress'
                                    ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/20'
                                  }`}
                              >
                                {existingComplaint.status === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {existingComplaint.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                                {existingComplaint.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                {existingComplaint.statusLabel}
                              </Badge>
                            </div>

                            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {COMPLAINT_CATEGORY_LABELS[existingComplaint.category]}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Filed {new Date(existingComplaint.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {existingComplaint.description}
                              </p>
                            </div>

                            {existingComplaint.adminResponse && (
                              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-medium text-primary">Our Response</span>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                  {existingComplaint.adminResponse}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : canFileData?.canFile ? (
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                              Having an Issue?
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              If you experienced any problems with this order, let us know and we&apos;ll help resolve it
                              {canFileData.daysRemaining && (
                                <span className="block mt-1 text-orange-600 dark:text-orange-400">
                                  ⏰ {canFileData.daysRemaining} {canFileData.daysRemaining === 1 ? 'day' : 'days'} remaining to file
                                </span>
                              )}
                            </p>
                            <Button
                              onClick={() => setShowComplaintModal(true)}
                              variant="outline"
                              className="h-10 sm:h-11 text-xs sm:text-sm border-2 border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              File a Complaint
                            </Button>
                          </div>
                        ) : canFileData?.reason === 'window_expired' ? (
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-muted-foreground mb-1">
                              Complaint Window Closed
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              The 7-day window to file a complaint has passed. Contact support for assistance.
                            </p>
                          </div>
                        ) : (
                          // Default: show button (handles loading state and when canFile is true)
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                              Having an Issue?
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              If you experienced any problems with this order, let us know and we&apos;ll help resolve it
                            </p>
                            <Button
                              onClick={() => setShowComplaintModal(true)}
                              variant="outline"
                              className="h-10 sm:h-11 text-xs sm:text-sm border-2 border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              File a Complaint
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1 h-10 sm:h-11">
                  <Link href={CustomerRoutes.ORDER_INVOICE(id)} className="text-xs sm:text-sm">
                    <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Download Invoice
                  </Link>
                </Button>
                {canCancelOrder && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-10 sm:h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Link href={CustomerRoutes.ORDER_CANCEL(id)} className="text-xs sm:text-sm">
                      <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Cancel Order
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderTracker currentStatus={trackerStatus} statusHistory={statusHistory} isService={false} />
            </div>
          </div>


        </div>
      </section>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={id}
        productId={productId}
        itemName={order.items?.[0]?.productName || 'Order'}
        isService={false}
        existingReview={orderReview}
      />

      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        referenceType="productOrder"
        referenceId={id}
        orderName={order.items?.[0]?.productName || 'Product Order'}
        daysRemaining={canFileData?.daysRemaining}
      />
    </div>
  );
}

