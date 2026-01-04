'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wrench,
  XCircle,
  Car,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star
} from 'lucide-react';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useBooking, useSubmitBookingFeedback } from '@/api/domains/bookings/queries';
import { useComplaintByReference, useCanFileComplaint } from '@/api/domains/complaints/queries';
import { ComplaintModal } from '@/components/customer/ComplaintModal';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import type { BookingAddress } from '@/types/booking';
import { COMPLAINT_CATEGORY_LABELS } from '@/types/complaint';

const formatAddress = (address?: BookingAddress | string) => {
  if (!address) return 'Address not available';

  if (typeof address === 'string') {
    return address;
  }

  if (address.fullAddress) {
    return address.fullAddress;
  }

  const streetParts = [address.line1, address.line2].filter(Boolean);
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  const location = [cityState, address.pincode].filter(Boolean).join(' - ');

  return [...streetParts, location].filter(Boolean).join(', ');
};

export default function ServiceOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const submitFeedback = useSubmitBookingFeedback();

  const {
    data: booking,
    isLoading,
    error
  } = useBooking(id);

  const { data: existingComplaint } = useComplaintByReference('booking', id);
  const { data: canFileData } = useCanFileComplaint('booking', id);
  const serviceId = booking?.serviceId;

  const normalizedStatus = (booking?.status || '').toLowerCase();
  const isCompleted = normalizedStatus === 'completed' || normalizedStatus === 'delivered';

  if (isLoading) {
    return <Loading text="Loading booking details..." />;
  }

  if (!booking || error) {
    return <Error message="Booking not found" details={(error as any)?.message} />;
  }

  const addressDetails = booking.address;
  const formattedAddress = formatAddress(addressDetails);
  const isAddressObject = typeof addressDetails !== 'string' && !!addressDetails;
  const vehicleDetails = booking.vehicleDetails;
  const vehicleName = vehicleDetails
    ? vehicleDetails.bodyType || 'N/A'
    : 'N/A';

  // Format scheduled date and time for display
  const formatScheduledSlot = () => {
    if (!booking.scheduledDate) return 'Not scheduled';

    try {
      const date = new Date(booking.scheduledDate);
      if (isNaN(date.getTime())) {
        // Try parsing as YYYY-MM-DD
        const [year, month, day] = booking.scheduledDate.split('-');
        if (year && month && day) {
          const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(parsedDate.getTime())) {
            const formattedDate = parsedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            if (booking.scheduledTime) {
              const [hours, minutes] = booking.scheduledTime.split(':');
              if (hours && minutes) {
                const hour12 = parseInt(hours) % 12 || 12;
                const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                return `${formattedDate} at ${hour12}:${minutes} ${ampm}`;
              }
              return `${formattedDate} at ${booking.scheduledTime}`;
            }
            return formattedDate;
          }
        }
        return booking.scheduledDate;
      }

      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (booking.scheduledTime) {
        const [hours, minutes] = booking.scheduledTime.split(':');
        if (hours && minutes) {
          const hour12 = parseInt(hours) % 12 || 12;
          const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
          return `${formattedDate} at ${hour12}:${minutes} ${ampm}`;
        }
        return `${formattedDate} at ${booking.scheduledTime}`;
      }
      return formattedDate;
    } catch (error) {
      return booking.scheduledTime
        ? `${booking.scheduledDate} • ${booking.scheduledTime}`
        : booking.scheduledDate;
    }
  };

  const trackerStatus = (() => {
    if (normalizedStatus === 'cancelled') return 'cancelled';
    if (normalizedStatus === 'completed') return 'delivered';
    if (normalizedStatus === 'in_progress') return 'shipped';
    if (normalizedStatus === 'confirmed') return 'confirmed';
    return 'processing';
  })();

  const statusHistory = [
    {
      status: 'processing',
      timestamp: new Date(booking.createdAt || Date.now()).toLocaleString(),
      label: 'Booking Placed'
    }
  ];

  const amount = booking.amount ?? booking.totalAmount ?? 0;



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
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Service Booking Details</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Booking #{id.slice(-6).toUpperCase()}</p>
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
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">Booking Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Booking Date</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Scheduled Slot</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">
                        {formatScheduledSlot()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Service Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Main Service */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {booking.serviceName || 'Service Booking'}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {booking.scheduledAt
                          ? new Date(booking.scheduledAt).toLocaleString()
                          : 'Schedule information unavailable'}
                      </p>
                    </div>
                  </div>

                  {/* Add-Ons (if any) */}
                  {booking.addOns && booking.addOns.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add-Ons</p>
                      {booking.addOns.map((addon, index) => (
                        <div
                          key={addon.addonId || addon.id || index}
                          className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                        >
                          <span className="text-sm text-foreground">{addon.name}</span>
                          <span className="text-sm font-medium text-primary">₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total */}
                  <Separator />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                    <span className="text-lg sm:text-xl font-bold text-primary">₹{amount}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg">Service Location</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {formattedAddress}
                    </p>
                    {isAddressObject && (
                      <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        {addressDetails?.label && (
                          <p className="font-medium text-foreground">Label: {addressDetails.label}</p>
                        )}
                        {addressDetails?.landmark && <p>Landmark: {addressDetails.landmark}</p>}
                        {addressDetails?.phone && <p>Contact: {addressDetails.phone}</p>}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {vehicleDetails && (
                <Card className="border-2 border-border">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <CardTitle className="text-base sm:text-lg">Vehicle Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-foreground capitalize">
                          {vehicleDetails.category || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Body Type</span>
                        <span className="font-medium text-foreground capitalize">
                          {vehicleDetails.bodyType || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Complaint Section - Only show for completed bookings */}
              {isCompleted && (
                <Card className="border-2 border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {existingComplaint ? (
                          // Show existing complaint
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
                          // Show file complaint option
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                              Having an Issue?
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              If you experienced any problems with this service, let us know and we&apos;ll help resolve it
                              {canFileData.hoursRemaining && (
                                <span className="block mt-1 text-orange-600 dark:text-orange-400">
                                  ⏰ {canFileData.hoursRemaining} {canFileData.hoursRemaining === 1 ? 'hour' : 'hours'} remaining to file
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
                          // Window expired
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-muted-foreground mb-1">
                              Complaint Window Closed
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              The 48-hour window to file a complaint has passed. Contact support for assistance.
                            </p>
                          </div>
                        ) : (
                          // Default: show button (handles loading state)
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                              Having an Issue?
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                              If you experienced any problems with this service, let us know and we&apos;ll help resolve it
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

              {/* Rating Section - Only show for completed bookings */}
              {isCompleted && (
                <Card className="border-2 border-border">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {booking.feedback?.rating ? (
                          // Show existing feedback
                          <div className="space-y-3">
                            <h3 className="font-semibold text-sm sm:text-base text-foreground">
                              Your Rating
                            </h3>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${star <= booking.feedback!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                {booking.feedback.rating}/5
                              </span>
                            </div>
                            {booking.feedback.comment && (
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                "{booking.feedback.comment}"
                              </p>
                            )}
                          </div>
                        ) : (
                          // Show rating form
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                                Rate Your Experience
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                How was your service? Your feedback helps us improve.
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`h-7 w-7 transition-colors ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground/30 hover:text-yellow-300'
                                      }`}
                                  />
                                </button>
                              ))}
                            </div>

                            <Textarea
                              placeholder="Share your experience (optional)..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="min-h-[80px] resize-none"
                              maxLength={500}
                            />

                            <Button
                              onClick={() => submitFeedback.mutate({ bookingId: id, rating, comment })}
                              disabled={rating === 0 || submitFeedback.isPending}
                              className="w-full sm:w-auto"
                            >
                              {submitFeedback.isPending ? 'Submitting...' : 'Submit Rating'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isCompleted && normalizedStatus !== 'cancelled' && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Link href={CustomerRoutes.ORDER_CANCEL_BOOKING(id)} className="text-xs sm:text-sm">
                    <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Cancel Booking
                  </Link>
                </Button>
              )}
            </div>

            <div className="lg:col-span-1">
              <OrderTracker
                currentStatus={trackerStatus}
                statusHistory={statusHistory}
                isService
                scheduledDate={booking.scheduledDate}
                scheduledTime={booking.scheduledTime}
              />
            </div>
          </div>


        </div>
      </section>

      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        referenceType="booking"
        referenceId={id}
        orderName={booking.serviceName || 'Service Booking'}
        hoursRemaining={canFileData?.hoursRemaining}
      />
    </div>
  );
}

