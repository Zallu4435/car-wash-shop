'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, Calendar, Briefcase, TrendingUp, Clock, CheckCircle } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Payments</h1>
        <p className="text-muted-foreground mt-1">Track your earnings and payment history</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Earnings</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹{totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending</p>
                <p className="text-sm text-muted-foreground">To Receive</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹{pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Jobs</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalJobs}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Payment History</CardTitle>
            </div>
            <Badge variant="outline">{payments.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((payment) => {
              const status = statusConfig[payment.status as keyof typeof statusConfig];
              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow border-2 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {payment.id}
                          </Badge>
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{payment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{payment.jobs} jobs</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <IndianRupee className="h-5 w-5 text-primary" />
                          <p className="text-2xl font-bold text-primary">
                            {payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
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
