'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCheck, Phone, MapPin, Calendar, Car, Mail, IndianRupee, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  status: 'pending',
  assignedStaff: null,
};

const availableStaff = [
  { id: 'staff_001', name: 'Rahul Kumar', area: 'Bandra, Khar', rating: 4.8, completedJobs: 156 },
  { id: 'staff_002', name: 'Amit Sharma', area: 'Andheri, Vile Parle', rating: 4.6, completedJobs: 89 },
  { id: 'staff_003', name: 'Vijay Patel', area: 'Borivali, Kandivali', rating: 4.7, completedJobs: 203 },
];

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');

  const handleAssign = () => {
    if (!selectedStaff) {
      toast.error('Please select a staff member');
      return;
    }
    toast.success('Staff assigned successfully!');
    setIsAssignDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/requests')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>
        {booking.status === 'pending' && (
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <UserCheck className="mr-2 h-4 w-4" />
            Assign Staff
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Booking #{booking.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Service Request Details</p>
                  </div>
                </div>
                <Badge className={
                  booking.status === 'pending' ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' :
                  booking.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' :
                  'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400'
                }>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3 text-foreground">Customer Details</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{booking.customer.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{booking.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{booking.customer.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Info */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3 text-foreground">Service Details</h3>
                <p className="text-lg font-semibold text-foreground mb-3">{booking.service}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date}</span>
                  </div>
                  <Badge variant="outline">{booking.time}</Badge>
                </div>
              </div>

              <Separator />

              {/* Vehicle Info */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </h3>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {booking.vehicle.brand} {booking.vehicle.model}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono">{booking.vehicle.plateNumber}</Badge>
                  <span>Year: {booking.vehicle.year}</span>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5" />
                  Service Location
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{booking.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Payment Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">₹{booking.amount}</p>
              </div>

              {booking.paymentType === 'advance' && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Advance Paid</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">₹{booking.advancePaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Balance to Collect</span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">₹{booking.balanceAmount}</span>
                    </div>
                  </div>
                </>
              )}

              {booking.paymentType === 'advance' && (
                <>
                  <Separator />
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Payment Note</p>
                        <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                          Staff must collect ₹{booking.balanceAmount} after service completion
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Staff Member</DialogTitle>
            <DialogDescription>
              Select a staff member to handle this service request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Select Staff</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Choose staff member" />
                </SelectTrigger>
                <SelectContent>
                  {availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{staff.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ⭐ {staff.rating} • {staff.completedJobs} jobs
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedStaff && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  The selected staff member will be notified immediately via SMS and app notification.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
