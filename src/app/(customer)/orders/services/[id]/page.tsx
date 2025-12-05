'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wrench,
  XCircle,
  Star,
  Edit,
  Car,
  FileText
} from 'lucide-react';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTracker } from '@/components/customer/OrderTracker';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/api/domains/bookings/queries';
import { useReviewByBooking, useReviewsByService } from '@/api/domains/reviews/queries';
import { ReviewModal } from '@/components/customer/ReviewModal';
import { ReviewsList } from '@/components/customer/ReviewsList';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import type { BookingAddress } from '@/types/booking';

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
  const [showReviewModal, setShowReviewModal] = useState(false);

  const {
    data: booking,
    isLoading,
    error
  } = useBooking(id);

  const { data: bookingReview } = useReviewByBooking(id);
  const serviceId = booking?.serviceId;
  const { data: serviceReviews = [] } = useReviewsByService(serviceId || 'service_001');

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
    ? [vehicleDetails.brand || (vehicleDetails as { make?: string })?.make, vehicleDetails.model]
        .filter(Boolean)
        .join(' ') || 'N/A'
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

  const averageRating = serviceReviews.length
    ? serviceReviews.reduce((sum, review) => sum + review.rating, 0) / serviceReviews.length
    : 0;

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
                <CardContent>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {booking.serviceName || 'Service Booking'}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                        {booking.scheduledAt
                          ? new Date(booking.scheduledAt).toLocaleString()
                          : 'Schedule information unavailable'}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-primary mt-1 sm:mt-2">₹{amount}</p>
                    </div>
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
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium text-foreground capitalize">
                          {vehicleDetails.type || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium text-foreground">
                          {vehicleName}
                        </span>
                      </div>
                      {vehicleDetails.number && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Number</span>
                          <span className="font-medium text-foreground">
                            {vehicleDetails.number}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {isCompleted && (
                <Card className="border-2 border-border bg-gradient-to-br from-primary/5 to-background">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 sm:mb-2">
                          {bookingReview ? 'Your Review' : 'Rate Your Experience'}
                        </h3>
                        {bookingReview ? (
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                    star <= bookingReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm sm:text-base font-medium text-foreground ml-1">
                                {bookingReview.rating}.0
                              </span>
                            </div>
                            {bookingReview.comment && (
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {bookingReview.comment}
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

              {!isCompleted && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 sm:h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Link href={CustomerRoutes.ORDER_CANCEL(id)} className="text-xs sm:text-sm">
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

          <div className="mt-6 sm:mt-8">
            <ReviewsList
              reviews={serviceReviews}
              averageRating={averageRating}
              totalReviews={serviceReviews.length}
              serviceName={booking.serviceName}
            />
          </div>
        </div>
      </section>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookingId={id}
        serviceId={serviceId}
        itemName={booking.serviceName || 'Service'}
        isService
        existingReview={bookingReview}
      />
    </div>
  );
}

