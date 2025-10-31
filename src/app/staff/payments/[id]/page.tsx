'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  IndianRupee, 
  Calendar, 
  Briefcase, 
  CheckCircle,
  CreditCard,
  MapPin,
  User
} from 'lucide-react';

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Mock data - Replace with actual API call
  const payment = {
    id: id,
    amount: 2500,
    date: '2024-10-25',
    status: 'paid',
    jobId: 'JOB001',
    service: 'Premium Car Wash',
    customer: 'John Doe',
    paymentMethod: 'Cash',
    location: 'Sector 21, Pune',
    duration: '45 mins',
    notes: 'Customer was satisfied with the service',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Payment Summary Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Payment Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment ID: {payment.id}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="text-sm">
                Paid
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Section */}
            <div className="p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-8 w-8 text-primary" />
                <p className="text-4xl font-bold text-primary">
                  {payment.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Date</p>
                    <p className="font-medium">{payment.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{payment.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Job ID</p>
                    <p className="font-medium">{payment.jobId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{payment.customer}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Service Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Service</span>
                  <span className="font-medium">{payment.service}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{payment.duration}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <div className="flex items-center gap-1 text-right">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">{payment.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Notes</h3>
                  <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                    {payment.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => router.push(`/staff/jobs/${payment.jobId}`)}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            View Job Details
          </Button>
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
