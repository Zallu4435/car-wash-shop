'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, User, Calendar, Clock, Car, DollarSign, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NavigationMap } from '@/components/staff/NavigationMap';
import { getBookingById } from '@/lib/api/mockData';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const booking = getBookingById(id);

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full border-2">
          <CardContent className="pt-12 pb-8 text-center">
            <p className="text-xl font-semibold text-foreground mb-4">Job not found</p>
            <Button onClick={() => router.push('/staff/jobs')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/staff/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <Badge variant="default" className="text-sm">
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Job Details</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono w-fit">
                {id}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Customer</p>
                </div>
                <p className="font-bold text-lg text-foreground">{booking.customer.name}</p>
                <a 
                  href={`tel:${booking.customer.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline mt-1"
                >
                  <Phone className="h-3 w-3" />
                  {booking.customer.phone}
                </a>
              </div>

              {/* Service */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Service</p>
                </div>
                <p className="font-semibold text-foreground">{booking.service}</p>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                  </div>
                  <p className="font-semibold text-foreground">{booking.date}</p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                  </div>
                  <p className="font-semibold text-foreground">{booking.time}</p>
                </div>
              </div>

              {/* Vehicle */}
              <div className="p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Vehicle</p>
                </div>
                <p className="font-semibold text-foreground">
                  {booking.vehicle.brand} {booking.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground font-mono">{booking.vehicle.plateNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Payment Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-lg text-foreground">₹{booking.amount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <span className="text-green-700 dark:text-green-400">Advance Paid</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">₹{booking.advancePaid}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold text-foreground">Balance to Collect</span>
                <span className="font-bold text-2xl text-primary">₹{booking.balanceAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Complete Button */}
          <Button 
            asChild 
            className="w-full shadow-lg" 
            size="lg"
          >
            <a href={`/staff/jobs/${id}/complete`}>
              <CheckCircle className="mr-2 h-5 w-5" />
              Mark as Completed
            </a>
          </Button>
        </div>

        {/* Right Column - Navigation */}
        <div className="lg:col-span-1">
          <NavigationMap
            address={booking.address}
            customerPhone={booking.customer.phone}
          />
        </div>
      </div>
    </div>
  );
}
