'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, IndianRupee, CreditCard, Wallet, TrendingUp, PieChart, Smartphone, Building2 } from 'lucide-react';

export default function PaymentReportsPage() {
  const paymentMethods = [
    { 
      method: 'UPI / PhonePe / Google Pay', 
      amount: 78450, 
      percentage: 43, 
      color: 'hsl(221 83% 53%)',
      icon: Smartphone 
    },
    { 
      method: 'Credit/Debit Card', 
      amount: 45678, 
      percentage: 25, 
      color: 'hsl(280 65% 60%)',
      icon: CreditCard 
    },
    { 
      method: 'Cash on Delivery', 
      amount: 46230, 
      percentage: 26, 
      color: 'hsl(30 80% 55%)',
      icon: Wallet 
    },
    { 
      method: 'Net Banking', 
      amount: 11412, 
      percentage: 6, 
      color: 'hsl(160 60% 45%)',
      icon: Building2 
    },
  ];

  const recentTransactions = [
    { id: 'TXN001', type: 'Service', amount: 1299, method: 'UPI', status: 'Success', date: '2025-10-24' },
    { id: 'TXN002', type: 'Product', amount: 2450, method: 'Card', status: 'Success', date: '2025-10-24' },
    { id: 'TXN003', type: 'Service', amount: 899, method: 'COD', status: 'Pending', date: '2025-10-23' },
    { id: 'TXN004', type: 'Product', amount: 1850, method: 'Net Banking', status: 'Success', date: '2025-10-23' },
    { id: 'TXN005', type: 'Service', amount: 1599, method: 'UPI', status: 'Success', date: '2025-10-22' },
  ];

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
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}
              >
                <IndianRupee className="h-6 w-6" style={{ color: 'hsl(160 60% 45%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              ₹1,81,770
            </p>
            <p className="text-sm mt-2 flex items-center gap-1" style={{ color: 'hsl(160 60% 45%)' }}>
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}
              >
                <CreditCard className="h-6 w-6" style={{ color: 'hsl(221 83% 53%)' }} />
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

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'hsl(30 80% 55% / 0.1)' }}
              >
                <Wallet className="h-6 w-6" style={{ color: 'hsl(30 80% 55%)' }} />
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
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <PieChart className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((payment) => {
              const Icon = payment.icon;
              return (
                <div key={payment.method} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${payment.color} / 0.1` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: payment.color }} />
                      </div>
                      <span className="font-medium text-foreground">{payment.method}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">₹{payment.amount.toLocaleString()}</span>
                      <span className="font-bold text-foreground w-12 text-right">{payment.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${payment.percentage}%`,
                        backgroundColor: payment.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <IndianRupee className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle>Recent High-Value Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => {
              const statusStyle = txn.status === 'Success' 
                ? {
                    backgroundColor: 'hsl(160 60% 45% / 0.1)',
                    color: 'hsl(160 60% 45%)',
                    borderColor: 'hsl(160 60% 45% / 0.3)'
                  }
                : {
                    backgroundColor: 'hsl(30 80% 55% / 0.1)',
                    color: 'hsl(30 80% 55%)',
                    borderColor: 'hsl(30 80% 55% / 0.3)'
                  };

              return (
                <div key={txn.id} className="flex items-center justify-between p-5 bg-muted rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                    >
                      <IndianRupee className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono">{txn.id}</Badge>
                        <Badge 
                          variant="outline"
                          style={{
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color,
                            borderColor: statusStyle.borderColor
                          }}
                        >
                          {txn.status}
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground">{txn.type}</p>
                      <p className="text-sm text-muted-foreground">{txn.method} • {txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                      ₹{txn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
