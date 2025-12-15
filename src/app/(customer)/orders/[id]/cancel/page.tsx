'use client';

// @ts-nocheck
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CustomerRoutes } from '@/lib/constants/routes';
import { useCancelOrder } from '@/api/domains/orders/queries';
import { useCancelBooking } from '@/api/domains/bookings/queries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cancelBookingSchema, CancelBookingInput } from '@/schemas/customer/booking';

export default function CancelOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Determine if it's a booking based on ID prefix
  const isBooking = id.startsWith('booking_');
  const detailHref = isBooking
    ? CustomerRoutes.ORDER_SERVICE_DETAIL(id)
    : CustomerRoutes.ORDER_PRODUCT_DETAIL(id);

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
        onSuccess: () => {
          toast.success('Booking cancelled successfully');
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
                  {/* Warning */}
                  <div className="bg-red-600 dark:bg-red-700 border-2 border-red-700 dark:border-red-600 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white mb-1">
                          Warning: This action cannot be undone
                        </p>
                        <p className="text-sm text-red-100">
                          {isBooking
                            ? 'Are you sure you want to cancel this booking? Cancellation charges may apply based on the timing.'
                            : 'Are you sure you want to cancel this order? Your refund will be processed within 5-7 business days.'}
                        </p>
                      </div>
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
