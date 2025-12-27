'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCheck, Phone, MapPin, Calendar, Car, Mail, IndianRupee, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { LocationMap } from '@/components/shared/display/LocationMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useConfirmation } from '@/hooks/useConfirmation';
import { AdminRoutes } from '@/lib/constants/routes';
import { DangerZone } from '@/components/admin/DangerZone';
import { AssignStaffModal } from '@/components/admin/AssignStaffModal';
import { useAdminBookingDetail, useAssignStaffToBooking, useRemoveStaffAssignment, useUpdateBookingStatus } from '@/api/domains/admin-requests/queries';
import { useAdminStaffList, useStaffLeavesByDate } from '@/api/domains/admin-staff/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const cancelConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: booking, isLoading: isLoadingBooking, error: bookingError, refetch: refetchBooking } = useAdminBookingDetail(id);
  const { data: staffData } = useAdminStaffList({ status: 'active', limit: 100 });
  const { data: leavesData } = useStaffLeavesByDate(booking?.scheduledDate);
  const assignStaffMutation = useAssignStaffToBooking();
  const removeStaffMutation = useRemoveStaffAssignment();
  const updateStatusMutation = useUpdateBookingStatus();

  // Filter out staff who are on leave for the booking's scheduled date
  const staffOnLeaveIds = new Set(leavesData?.map((l) => l.staffId) || []);
  const availableStaff = (staffData?.data || [])
    .filter((staff) => !staffOnLeaveIds.has(staff.id))
    .map((staff) => ({
      id: staff.id,
      name: staff.name,
      phone: staff.phone || '',
      area: 'N/A',
      rating: staff.avgRating || 0,
      completedJobs: staff.totalJobs || 0,
    }));

  const handleAssign = async (staffId: string) => {
    try {
      await assignStaffMutation.mutateAsync({
        bookingId: id,
        input: { staffId },
      });
      setIsAssignDialogOpen(false);
      refetchBooking();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleRemoveStaff = async () => {
    if (!booking?.assignedStaff) return;

    const confirmed = await cancelConfirmation.confirm({
      type: 'warning',
      title: 'Remove Assigned Staff?',
      description: 'This will unassign the staff member from this booking. The booking will return to pending status.',
      confirmText: 'Yes, Remove Staff',
      cancelText: 'Cancel',
      itemName: typeof booking.assignedStaff === 'object' && booking.assignedStaff ? booking.assignedStaff.name : 'Staff',
    });

    if (confirmed) {
      try {
        await removeStaffMutation.mutateAsync(id);
        refetchBooking();
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleCancelRequest = async () => {
    if (!booking) return;

    const confirmed = await cancelConfirmation.confirm({
      type: 'warning',
      title: 'Cancel Request?',
      description: 'This will cancel the service request and notify the customer. The customer will be refunded if advance payment was made.',
      confirmText: 'Yes, Cancel Request',
      cancelText: 'Keep Request',
      itemName: `Request #${booking.id}`,
    });

    if (confirmed) {
      try {
        await updateStatusMutation.mutateAsync({
          bookingId: id,
          status: 'cancelled',
          note: 'Cancelled by admin',
        });
        router.push(AdminRoutes.REQUESTS);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleDeleteRequest = async () => {
    if (!booking) return;

    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Request?',
      description: 'This will permanently delete this service request from the system. This action cannot be undone.',
      confirmText: 'Yes, Delete Request',
      cancelText: 'Cancel',
      itemName: `Request #${booking.id}`,
    });

    if (confirmed) {
      // TODO: Implement delete endpoint if needed
      toast.error('Delete functionality not yet implemented');
    }
  };

  if (isLoadingBooking) {
    return <Loading text="Loading booking details..." />;
  }

  if (bookingError || !booking) {
    return (
      <Error
        message="Failed to load booking"
        details={(bookingError as any)?.message}
        onRetry={() => refetchBooking()}
      />
    );
  }

  const formatTime = (time: string) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const balanceAmount = booking.paymentType === 'advance' && booking.advanceAmount
    ? (booking.totalAmount || booking.amount) - booking.advanceAmount
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.REQUESTS)} className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Requests
        </Button>
        {booking.status === 'pending' && (!booking.assignedStaff || (typeof booking.assignedStaff === 'string' && !booking.assignedStaff)) && (
          <Button onClick={() => setIsAssignDialogOpen(true)} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
            <UserCheck className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Assign Staff
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Main Info Card */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base lg:text-lg truncate">
                      Booking #{booking.id}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">Service Request Details</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    `text-[10px] sm:text-xs flex-shrink-0 border-2 ${booking.status === 'pending' ? 'border-orange-500 text-orange-600 dark:text-orange-400' :
                      booking.status === 'confirmed' ? 'border-blue-500 text-blue-600 dark:text-blue-400' :
                        booking.status === 'completed' ? 'border-green-500 text-green-600 dark:text-green-400' :
                          'border-red-500 text-red-600 dark:text-red-400'}`
                  }>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Customer Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-foreground">Customer Details</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-semibold text-sm sm:text-base text-foreground">{booking.customerDetails?.name || 'Unknown'}</p>
                  {booking.customerDetails?.phone && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{booking.customerDetails.phone}</span>
                    </div>
                  )}
                  {booking.customerDetails?.email && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{booking.customerDetails.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Service Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-foreground">Service Details</h3>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{booking.service || 'Service'}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{booking.scheduledDate}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    {booking.scheduledTime ? formatTime(booking.scheduledTime) : 'N/A'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Add-Ons */}
              {booking.addOns && booking.addOns.length > 0 && (
                <>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-foreground">Add-Ons</h3>
                    <div className="space-y-2">
                      {booking.addOns.map((addon, index) => (
                        <div
                          key={addon.addonId || index}
                          className="flex items-center justify-between p-2 sm:p-3 bg-background rounded-lg border-2 border-border"
                        >
                          <span className="text-xs sm:text-sm font-medium text-foreground">{addon.name}</span>
                          <span className="text-xs sm:text-sm font-semibold text-primary">₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-border flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">Add-Ons Total</span>
                      <span className="text-sm sm:text-base font-bold text-primary">
                        ₹{booking.addOns.reduce((sum, addon) => sum + addon.price, 0)}
                      </span>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Vehicle Info */}
              {booking.vehicleDetails && (
                <>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Vehicle Details
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-foreground mb-1 capitalize">
                      {booking.vehicleDetails.bodyType}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {booking.vehicleDetails.category}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Address */}
              {booking.address && (
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Service Location
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-3">
                    {typeof booking.address === 'string'
                      ? booking.address
                      : (booking.address.fullAddress ||
                        `${booking.address.line1}${booking.address.line2 ? ', ' + booking.address.line2 : ''}, ${booking.address.city}, ${booking.address.state} - ${booking.address.pincode}`)}
                  </p>
                </div>
              )}

              {/* Map Display */}
              {booking.coordinates && booking.coordinates.latitude && booking.coordinates.longitude && (
                <>
                  <Separator />
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 text-foreground">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      Location Map
                    </h3>
                    <LocationMap
                      latitude={booking.coordinates.latitude}
                      longitude={booking.coordinates.longitude}
                      address={typeof booking.address === 'string'
                        ? booking.address
                        : (booking.address?.fullAddress ||
                          `${booking.address?.line1 || ''}${booking.address?.line2 ? ', ' + booking.address.line2 : ''}, ${booking.address?.city || ''}, ${booking.address?.state || ''} - ${booking.address?.pincode || ''}`)}
                      height="400px"
                    />
                  </div>
                </>
              )}

              {/* Assigned Staff - Show only if staff is assigned */}
              {booking.assignedStaff && typeof booking.assignedStaff === 'object' && (
                <>
                  <Separator />
                  <div className="p-3 sm:p-4 bg-primary/5 border-2 border-primary/20 rounded-lg sm:rounded-xl">
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 mb-2 sm:mb-3">
                      <h3 className="font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 text-foreground">
                        <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" />
                        Assigned Staff
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 w-full xs:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAssignDialogOpen(true)}
                          className="flex-1 xs:flex-initial h-8 sm:h-9 text-xs sm:text-sm border-2"
                        >
                          <UserCheck className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Change
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveStaff}
                          disabled={removeStaffMutation.isPending}
                          className="flex-1 xs:flex-initial h-8 sm:h-9 text-xs sm:text-sm border-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-2.5">
                      <p className="font-semibold text-sm sm:text-base text-foreground">{booking.assignedStaff.name}</p>
                      {booking.assignedStaff.phone && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{booking.assignedStaff.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Payment Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Total Amount */}
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Total Amount</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">₹{booking.totalAmount || booking.amount}</p>
              </div>

              {/* Advance Amount Paid */}
              {booking.paymentType === 'advance' && booking.advanceAmount && (
                <>
                  <Separator />
                  <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800/50 rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Advance Paid</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">₹{booking.advanceAmount}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone - Show only if booking is not already cancelled */}
          {booking.status !== 'cancelled' && (
            <DangerZone
              description="Irreversible actions that affect this service request"
              actions={[
                {
                  title: 'Cancel Request',
                  description: 'Cancel the service request and notify customer with refund',
                  buttonText: 'Cancel Request',
                  buttonIcon: XCircle,
                  onClick: handleCancelRequest,
                  variant: 'outline',
                  buttonClassName: 'border-orange-300 dark:border-orange-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30',
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        availableStaff={availableStaff}
        currentStaffId={typeof booking.assignedStaff === 'object' && booking.assignedStaff ? booking.assignedStaff.id : undefined}
        onAssign={handleAssign}
        mode={(typeof booking.assignedStaff === 'object' && booking.assignedStaff) ? 'change' : 'assign'}
      />

      {/* Confirmation Dialogs */}
      <cancelConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
