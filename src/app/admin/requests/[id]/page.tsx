'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCheck, Phone, MapPin, Calendar, Car, Mail, IndianRupee, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useConfirmation } from '@/hooks/useConfirmation';
import { DangerZone } from '@/components/admin/DangerZone';
import { AssignStaffModal } from '@/components/admin/AssignStaffModal';

const booking = {
  id: 'BK001',
  customer: { name: 'Rahul Kumar', phone: '+91 98765 43210', email: 'rahul@example.com' },
  service: 'Premium Wash + Wax Coating',
  vehicle: { brand: 'Toyota', model: 'Camry', plateNumber: 'MH12AB1234', year: 2023 },
  date: '2025-10-25',
  time: '10:00 AM',
  address: '123, MG Road, Bandra West, Mumbai, Maharashtra - 400050',
  amount: 649,
  paymentType: 'advance',
  advancePaid: 195,
  balanceAmount: 454,
  status: 'in-progress',
  assignedStaff: { 
    id: 'staff_001', 
    name: 'Rahul Kumar', 
    phone: '+91 98765 12345',
    area: 'Bandra, Khar', 
    rating: 4.8, 
    completedJobs: 156 
  },
};

const availableStaff = [
  { id: 'staff_001', name: 'Rahul Kumar', area: 'Bandra, Khar', rating: 4.8, completedJobs: 156 },
  { id: 'staff_002', name: 'Amit Sharma', area: 'Andheri, Vile Parle', rating: 4.6, completedJobs: 89 },
  { id: 'staff_003', name: 'Vijay Patel', area: 'Borivali, Kandivali', rating: 4.7, completedJobs: 203 },
];

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const cancelConfirmation = useConfirmation();
  const deleteConfirmation = useConfirmation();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssign = (staffId: string) => {
    // TODO: Call API to assign staff
    const staff = availableStaff.find(s => s.id === staffId);
    toast.success(`${staff?.name} assigned successfully!`);
  };

  const handleRemoveStaff = async () => {
    const confirmed = await cancelConfirmation.confirm({
      type: 'warning',
      title: 'Remove Assigned Staff?',
      description: 'This will unassign the staff member from this booking. The booking will return to pending status.',
      confirmText: 'Yes, Remove Staff',
      cancelText: 'Cancel',
      itemName: booking.assignedStaff?.name || 'Staff',
    });

    if (confirmed) {
      // TODO: Call API to remove staff
      toast.success('Staff removed successfully');
    }
  };

  const handleCancelRequest = async () => {
    const confirmed = await cancelConfirmation.confirm({
      type: 'warning',
      title: 'Cancel Request?',
      description: 'This will cancel the service request and notify the customer. The customer will be refunded if advance payment was made.',
      confirmText: 'Yes, Cancel Request',
      cancelText: 'Keep Request',
      itemName: `Request #${booking.id}`,
    });

    if (confirmed) {
      // TODO: Call API to cancel request
      toast.success('Request has been cancelled and customer notified');
      router.push('/admin/requests');
    }
  };

  const handleDeleteRequest = async () => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Request?',
      description: 'This will permanently delete this service request from the system. This action cannot be undone.',
      confirmText: 'Yes, Delete Request',
      cancelText: 'Cancel',
      itemName: `Request #${booking.id}`,
    });

    if (confirmed) {
      // TODO: Call API to delete request
      toast.success('Request has been deleted');
      router.push('/admin/requests');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/requests')} className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Requests
        </Button>
        {booking.status === 'pending' && (
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
                    <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Booking #{booking.id}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">Service Request Details</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={
                  `text-[10px] sm:text-xs flex-shrink-0 border-2 ${
                  booking.status === 'pending' ? 'border-orange-500 text-orange-600 dark:text-orange-400' :
                  booking.status === 'in-progress' ? 'border-blue-500 text-blue-600 dark:text-blue-400' :
                  'border-green-500 text-green-600 dark:text-green-400'}`
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
                  <p className="font-semibold text-sm sm:text-base text-foreground">{booking.customer.name}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{booking.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{booking.customer.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 text-foreground">Service Details</h3>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{booking.service}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{booking.date}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{booking.time}</Badge>
                </div>
              </div>

              <Separator />

              {/* Vehicle Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Vehicle Details
                </h3>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
                  {booking.vehicle.brand} {booking.vehicle.model}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono text-[10px] sm:text-xs">{booking.vehicle.plateNumber}</Badge>
                  <span>Year: {booking.vehicle.year}</span>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Service Location
                </h3>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{booking.address}</p>
              </div>

              {/* Assigned Staff - Show only if staff is assigned */}
              {booking.assignedStaff && (
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
                          className="flex-1 xs:flex-initial h-8 sm:h-9 text-xs sm:text-sm border-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-2.5">
                      <p className="font-semibold text-sm sm:text-base text-foreground">{booking.assignedStaff.name}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>{booking.assignedStaff.phone}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          ⭐ {booking.assignedStaff.rating} Rating
                        </Badge>
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {booking.assignedStaff.completedJobs} Jobs
                        </Badge>
                      </div>
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
              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Total Amount</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">₹{booking.amount}</p>
              </div>

              {booking.paymentType === 'advance' && (
                <>
                  <Separator />
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                      <span className="text-muted-foreground">Advance Paid</span>
                      <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">₹{booking.advancePaid}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-foreground">Balance to Collect</span>
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-orange-600 dark:text-orange-400 flex-shrink-0">₹{booking.balanceAmount}</span>
                    </div>
                  </div>
                </>
              )}

              {booking.paymentType === 'advance' && (
                <>
                  <Separator />
                  <div className="p-2.5 sm:p-3 lg:p-4 bg-orange-500/10 dark:bg-orange-500/20 border-2 border-orange-500/30 dark:border-orange-500/40 rounded-lg sm:rounded-xl">
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300">Payment Note</p>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-orange-600 dark:text-orange-400 mt-0.5 sm:mt-1 leading-relaxed">
                          Staff must collect ₹{booking.balanceAmount} after service completion
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
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
              {
                title: 'Delete Request',
                description: 'Permanently remove this request from the system',
                buttonText: 'Delete',
                buttonIcon: Trash2,
                onClick: handleDeleteRequest,
              },
            ]}
          />
        </div>
      </div>

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        availableStaff={availableStaff}
        currentStaffId={booking.assignedStaff?.id}
        onAssign={handleAssign}
        mode={booking.assignedStaff ? 'change' : 'assign'}
      />

      {/* Confirmation Dialogs */}
      <cancelConfirmation.ConfirmDialog />
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
