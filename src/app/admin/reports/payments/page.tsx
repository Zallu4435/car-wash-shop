'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, IndianRupee, CreditCard, Wallet, TrendingUp, PieChart } from 'lucide-react';

export default function PaymentReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Payment Reports</h1>
          <p className="text-muted-foreground mt-1">Financial analytics and payment methods</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">₹1,81,770</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online Payments</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹1,35,540</p>
            <p className="text-sm text-muted-foreground mt-2">
              74.6% of total revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-xl">
                <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">COD Payments</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">₹46,230</p>
            <p className="text-sm text-muted-foreground mt-2">
              25.4% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { method: 'UPI / PhonePe / Google Pay', amount: 78450, percentage: 43, color: 'bg-blue-500' },
              { method: 'Credit/Debit Card', amount: 45678, percentage: 25, color: 'bg-purple-500' },
              { method: 'Cash on Delivery', amount: 46230, percentage: 26, color: 'bg-orange-500' },
              { method: 'Net Banking', amount: 11412, percentage: 6, color: 'bg-green-500' },
            ].map((payment) => (
              <div key={payment.method} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${payment.color}`} />
                    <span className="font-medium text-foreground">{payment.method}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">₹{payment.amount.toLocaleString()}</span>
                    <span className="font-bold text-foreground w-12 text-right">{payment.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${payment.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${payment.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Recent High-Value Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'TXN001', type: 'Service', amount: 1299, method: 'UPI', status: 'Success' },
              { id: 'TXN002', type: 'Product', amount: 2450, method: 'Card', status: 'Success' },
              { id: 'TXN003', type: 'Service', amount: 899, method: 'COD', status: 'Pending' },
            ].map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">{txn.id}</Badge>
                  <div>
                    <p className="font-semibold text-foreground">{txn.type}</p>
                    <p className="text-sm text-muted-foreground">{txn.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">₹{txn.amount}</p>
                  <Badge variant={txn.status === 'Success' ? 'default' : 'secondary'}>
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
