'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, Calendar, Briefcase, TrendingUp, Clock } from 'lucide-react';

const payments = [
  { id: 'PAY001', date: '2025-10-24', jobs: 3, amount: 1398, status: 'paid' },
  { id: 'PAY002', date: '2025-10-23', jobs: 2, amount: 1198, status: 'paid' },
  { id: 'PAY003', date: '2025-10-22', jobs: 4, amount: 2196, status: 'pending' },
  { id: 'PAY004', date: '2025-10-21', jobs: 3, amount: 1457, status: 'paid' },
];

const statusConfig = {
  paid: {
    variant: 'default' as const,
    label: 'Paid',
  },
  pending: {
    variant: 'secondary' as const,
    label: 'Pending',
  },
};

export default function StaffPaymentsPage() {
  const totalEarnings = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalJobs = payments.reduce((sum, p) => sum + p.jobs, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          My Payments
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Track your earnings and payment history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                  Total Earnings
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  This Month
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              ₹{totalEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  To Receive
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              ₹{pendingAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                  Jobs
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Completed
                </p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              {totalJobs}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Payment History</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {payments.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((payment) => {
              const status = statusConfig[payment.status as keyof typeof statusConfig];
              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow border-2 border-border">
                  <CardContent className="p-3 sm:p-4">
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {payment.id}
                          </Badge>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{payment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{payment.jobs} jobs</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          <p className="text-xl sm:text-2xl font-bold text-primary">
                            {payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs sm:text-sm">
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="font-mono text-xs">
                            {payment.id}
                          </Badge>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <p className="text-lg font-bold text-primary">
                            {payment.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{payment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{payment.jobs} jobs</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full h-8 text-xs">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
