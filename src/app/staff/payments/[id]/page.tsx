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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="h-9 sm:h-10 text-xs sm:text-sm border-2">
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Payments
        </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {/* Payment Summary Card */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Payment Details</CardTitle>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                    Payment ID: {payment.id}
                  </p>
                </div>
              </div>
              <Badge variant="default" className="text-[10px] sm:text-xs flex-shrink-0">
                Paid
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Amount Section */}
            <div className="p-4 sm:p-5 lg:p-6 bg-primary/5 rounded-lg sm:rounded-xl border-2 border-primary/20">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Total Amount</p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IndianRupee className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  {payment.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Payment Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Payment Date</p>
                    <p className="font-medium text-xs sm:text-sm">{payment.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-xs sm:text-sm">{payment.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Job ID</p>
                    <p className="font-medium text-xs sm:text-sm">{payment.jobId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium text-xs sm:text-sm">{payment.customer}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Service Details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Service Details</h3>
              
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Service</span>
                  <span className="font-medium text-xs sm:text-sm text-right">{payment.service}</span>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium text-xs sm:text-sm">{payment.duration}</span>
                </div>

                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground">Location</span>
                  <div className="flex items-center gap-1 text-right">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-xs sm:text-sm">{payment.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg">Notes</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    {payment.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-2"
            onClick={() => router.push(`/staff/jobs/${payment.jobId}`)}
          >
            <Briefcase className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            View Job Details
          </Button>
          <Button 
            variant="default" 
            className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-2"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
