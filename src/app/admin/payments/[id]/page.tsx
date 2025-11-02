'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, IndianRupee, CreditCard, Calendar, User, Phone, Mail, MapPin, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminRoutes } from '@/lib/constants/routes';

// Mock payment data
const paymentData = {
  id: 'TXN001',
  amount: 1299,
  status: 'Success',
  method: 'UPI',
  type: 'Service Booking',
  date: '2025-10-20 14:30:25',
  transactionId: 'UPI2025102014302512345',
  orderId: 'ORD001',
  customer: {
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    address: '123, MG Road, Bandra West, Mumbai - 400050'
  },
  paymentDetails: {
    subtotal: 1199,
    tax: 100,
    discount: 0,
    total: 1299,
  },
  timeline: [
    { status: 'Initiated', time: '2025-10-20 14:30:10', icon: Clock },
    { status: 'Processing', time: '2025-10-20 14:30:15', icon: Clock },
    { status: 'Success', time: '2025-10-20 14:30:25', icon: CheckCircle },
  ]
};

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const statusColors = {
    Success: { bgColor: 'bg-green-100 dark:bg-green-950/30', color: 'text-green-600 dark:text-green-400' },
    Pending: { bgColor: 'bg-yellow-100 dark:bg-yellow-950/30', color: 'text-yellow-600 dark:text-yellow-400' },
    Failed: { bgColor: 'bg-red-100 dark:bg-red-950/30', color: 'text-red-600 dark:text-red-400' },
  };

  const currentStatusStyle = statusColors[paymentData.status as keyof typeof statusColors] || statusColors.Pending;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => router.push(AdminRoutes.PAYMENTS)} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Payments
        </Button>
        <div className="flex flex-col xs:flex-row gap-2">
          <Button variant="outline" className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
            <FileText className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Download Receipt</span>
            <span className="xs:hidden">Receipt</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Payment Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Transaction Info */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Transaction #{paymentData.id}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{paymentData.date}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={`text-xs sm:text-sm flex-shrink-0 border-2 capitalize ${currentStatusStyle.color}`}
                >
                  {paymentData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Transaction Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Transaction ID</p>
                  <p className="font-mono text-[10px] xs:text-xs sm:text-sm font-semibold text-foreground break-all">{paymentData.transactionId}</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-1.5">Order ID</p>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-foreground">{paymentData.orderId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Payment Method</p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">{paymentData.method}</p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Transaction Type</p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">{paymentData.type}</p>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Customer Details
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="font-semibold text-sm sm:text-base text-foreground">{paymentData.customer.name}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{paymentData.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{paymentData.customer.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-foreground">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Billing Address
                </h3>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{paymentData.customer.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Timeline */}
          <Card className="border-2 border-border rounded-lg sm:rounded-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Payment Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {paymentData.timeline.map((event, index) => {
                  const Icon = event.icon;
                  const isLast = index === paymentData.timeline.length - 1;
                  return (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${isLast ? 'bg-green-100 dark:bg-green-950/30' : 'bg-muted'}`}>
                          <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLast ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                        </div>
                        {!isLast && <div className="w-0.5 h-full bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-xs sm:text-sm text-foreground">{event.status}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-border rounded-lg sm:rounded-xl lg:sticky lg:top-24">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">Payment Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground flex-shrink-0">₹{paymentData.paymentDetails.subtotal}</span>
                </div>
                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold text-foreground flex-shrink-0">₹{paymentData.paymentDetails.tax}</span>
                </div>
                {paymentData.paymentDetails.discount > 0 && (
                  <div className="flex justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-green-600 dark:text-green-400">Discount</span>
                    <span className="font-semibold text-green-600 dark:text-green-400 flex-shrink-0">-₹{paymentData.paymentDetails.discount}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">Total Paid</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{paymentData.paymentDetails.total}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-2.5">
                <Button 
                  variant="outline" 
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
                  onClick={() => router.push(AdminRoutes.ORDER_DETAIL(paymentData.orderId))}
                >
                  <FileText className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  View Order
                </Button>
                <Button variant="outline" className="w-full h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                  <Phone className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Contact Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
