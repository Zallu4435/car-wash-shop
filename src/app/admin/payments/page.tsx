'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, IndianRupee, CreditCard, Wallet, TrendingUp, PieChart, Smartphone, Building2 } from 'lucide-react';
import { usePaymentTransactions, usePaymentReport } from '@/api/domains/admin-payments/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { useState, useMemo } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { ExportButton } from '@/components/admin/ExportButton';

export default function PaymentReportsPage() {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    method: filterValues.method || undefined,
    dateRange: filterValues.dateRange || undefined,
  }), [search, filterValues]);

  const { data: paymentTransactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = usePaymentTransactions(filters);
  const { data: paymentReport, isLoading: reportLoading, error: reportError, refetch: refetchReport } = usePaymentReport();

  // Use API data - the hooks already return the data directly
  const transactions = paymentTransactions || [];
  const report = paymentReport || {};

  if (transactionsLoading || reportLoading) {
    return <Loading text="Loading payment data..." />;
  }

  if (transactionsError || reportError) {
    return (
      <Error 
        message="Failed to load payment data" 
        details={(transactionsError || reportError)?.message}
        onRetry={() => {
          refetchTransactions();
          refetchReport();
        }}
      />
    );
  }
  const paymentMethods = [
    { 
      method: 'UPI / PhonePe / Google Pay', 
      amount: (report as any).upiTotal || 0,
      percentage: (report as any).upiPercentage || 0,
      color: 'hsl(221 83% 53%)',
      icon: Smartphone 
    },
    { 
      method: 'Credit/Debit Card', 
      amount: (report as any).cardTotal || 0,
      percentage: (report as any).cardPercentage || 0,
      color: 'hsl(280 65% 60%)',
      icon: CreditCard 
    },
    { 
      method: 'Cash on Delivery', 
      amount: (report as any).codTotal || 0,
      percentage: (report as any).codPercentage || 0,
      color: 'hsl(30 80% 55%)',
      icon: Wallet 
    },
    { 
      method: 'Net Banking', 
      amount: (report as any).netBankingTotal || 0,
      percentage: (report as any).netBankingPercentage || 0,
      color: 'hsl(160 60% 45%)',
      icon: Building2 
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Payment Reports
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Financial analytics and payment methods
          </p>
        </div>
        <ExportButton
          data={transactions}
          filename={`payment-report-${new Date().toISOString().split('T')[0]}`}
          headers={['id', 'type', 'amount', 'method', 'status', 'date']}
          title="Payment Report"
          filters={{
            'Search': search || 'None',
            'Status': filterValues.status || 'All',
            'Method': filterValues.method || 'All',
            'Date Range': filterValues.dateRange || 'All Time',
          }}
          className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div 
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}
              >
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(160 60% 45%)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Revenue</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              ₹1,81,770
            </p>
            <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center gap-1" style={{ color: 'hsl(160 60% 45%)' }}>
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div 
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}
              >
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(221 83% 53%)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Online Payments</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">₹{((report as any).onlineTotal || 0).toLocaleString('en-IN')}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
              {(report as any).onlinePercentage || 0}% of total revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div 
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                style={{ backgroundColor: 'hsl(30 80% 55% / 0.1)' }}
              >
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(30 80% 55%)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">COD Payments</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">₹46,230</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
              25.4% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 sm:p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">Payment Methods Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {paymentMethods.map((payment) => {
              const Icon = payment.icon;
              return (
                <div key={payment.method} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div 
                        className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${payment.color} / 0.1` }}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: payment.color }} />
                      </div>
                      <span className="font-medium text-foreground truncate">{payment.method}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <span className="text-muted-foreground">₹{payment.amount.toLocaleString()}</span>
                      <span className="font-bold text-foreground w-10 sm:w-12 text-right">{payment.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
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
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 sm:p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg truncate">Recent High-Value Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search by transaction ID or type..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Success', value: 'success' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Failed', value: 'failed' },
                ],
              },
              {
                label: 'Payment Method',
                value: 'method',
                options: [
                  { label: 'All Methods', value: '' },
                  { label: 'UPI', value: 'upi' },
                  { label: 'Card', value: 'card' },
                  { label: 'COD', value: 'cod' },
                  { label: 'Net Banking', value: 'netbanking' },
                ],
              },
              {
                label: 'Date Range',
                value: 'dateRange',
                type: 'dateRange',
                options: [
                  { label: 'All Time', value: '' },
                  { label: 'Today', value: 'today' },
                  { label: 'Last 7 Days', value: 'last-7-days' },
                  { label: 'Last 30 Days', value: 'last-30-days' },
                  { label: 'Last 3 Months', value: 'last-3-months' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {transactions.length === 0 ? (
            <EmptyState
              icon={IndianRupee}
              title="No transactions found"
              description={search ? "Try adjusting your search or filters" : "No transactions yet"}
            />
          ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {transactions.map((txn: any) => {
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
                <div key={txn.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-muted rounded-lg sm:rounded-xl border border-border">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div 
                      className="p-2 sm:p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                    >
                      <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Badge variant="outline" className="font-mono text-xs">{txn.id}</Badge>
                        <Badge 
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color,
                            borderColor: statusStyle.borderColor
                          }}
                        >
                          {txn.status}
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-foreground">{txn.type}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{txn.method} • {txn.date}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-xl sm:text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                      ₹{txn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
