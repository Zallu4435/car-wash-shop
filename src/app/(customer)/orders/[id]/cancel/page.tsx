'use client';

// @ts-nocheck
import { use, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, XCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useCancelOrder } from '@/api/domains/orders/queries';
import { useCancelBooking, useBooking } from '@/api/domains/bookings/queries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cancelBookingSchema, CancelBookingInput } from '@/schemas/customer/booking';
import Loading from '@/components/shared/display/Loading';

export default function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine if it's a booking based on query param
  const isBooking = searchParams.get('type') === 'booking';
  const detailHref = isBooking
    ? CustomerRoutes.ORDER_SERVICE_DETAIL(id)
    : CustomerRoutes.ORDER_PRODUCT_DETAIL(id);

  // Fetch booking details to calculate refund eligibility
  const { data: booking, isLoading: bookingLoading } = useBooking(isBooking ? id : '');

  // Calculate refund eligibility - within 1 hour of booking creation
  const refundInfo = useMemo(() => {
    if (!isBooking || !booking?.createdAt) {
      return { eligible: false, reason: '', checked: false };
    }

    const now = new Date();
    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceBooking = (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);
    const isEligible = hoursSinceBooking <= 1;

    return {
      eligible: isEligible,
      reason: isEligible
        ? 'Cancelled within 1 hour of booking'
        : 'Cancellation window expired (more than 1 hour since booking)',
      checked: true,
      minutesRemaining: isEligible ? Math.max(0, Math.floor(60 - hoursSinceBooking * 60)) : 0,
    };
  }, [isBooking, booking?.createdAt]);

  const cancelOrderMutation = useCancelOrder();
  const cancelBookingMutation = useCancelBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelBookingInput>({
    resolver: zodResolver(cancelBookingSchema) as any,
    defaultValues: {
      bookingId: id,
      reason: '',
    },
  });

  const onSubmit = (data: CancelBookingInput) => {
    if (isBooking) {
      cancelBookingMutation.mutate(id, {
        onSuccess: (response: any) => {
          if (response?.refund?.eligible) {
            toast.success('Booking cancelled. Refund will be processed within 3-5 business days.');
          } else {
            toast.success('Booking cancelled successfully');
          }
          router.push(CustomerRoutes.ORDERS);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to cancel booking');
        },
      });
    } else {
      cancelOrderMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Order cancelled successfully');
          router.push(CustomerRoutes.ORDERS);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to cancel order');
        },
      });
    }
  };

  if (isBooking && bookingLoading) {
    return <Loading text="Loading booking details..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-50 to-background dark:from-red-950/20 border-b border-border">
        <div className="container-custom py-8">
          <Link href={detailHref}>
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isBooking ? 'Back to Booking' : 'Back to Order'}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {isBooking ? 'Cancel Booking' : 'Cancel Order'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isBooking ? 'Booking' : 'Order'} #{id}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>Confirm Cancellation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Warning with Refund Status */}
                  <div className="bg-red-600 dark:bg-red-700 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">
                          Warning: This action cannot be undone
                        </p>
                        <p className="text-sm text-red-100">
                          {isBooking
                            ? refundInfo.eligible
                              ? `Full refund available (${refundInfo.minutesRemaining} min left) • Processed in 3-5 business days`
                              : 'No refund available — cancellation window has expired (1 hour limit)'
                            : 'Your refund will be processed within 5-7 business days.'}
                        </p>
                      </div>
                      {isBooking && refundInfo.checked && (
                        <Badge
                          className={refundInfo.eligible
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-red-800 text-red-200'}
                        >
                          {refundInfo.eligible ? 'Refundable' : 'No Refund'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Reason Input */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      Reason for Cancellation <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      {...register('reason')}
                      placeholder={isBooking
                        ? "Please tell us why you're cancelling this booking..."
                        : "Please tell us why you're cancelling this order..."}
                      rows={5}
                    />
                    {errors.reason && (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.reason.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Minimum 10 characters • Your feedback helps us improve our service
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                    >
                      {isBooking ? 'Keep Booking' : 'Keep Order'}
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="flex-1 shadow-lg"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {cancelOrderMutation.isPending || cancelBookingMutation.isPending
                        ? 'Cancelling...'
                        : isBooking ? 'Cancel Booking' : 'Cancel Order'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
