'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, CreditCard, Wallet, PieChart, Smartphone, Building2 } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import { usePaymentTransactions, usePaymentReport } from '@/api/domains/admin-payments/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { useState, useMemo } from 'react';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { StatCard } from '@/components/admin/StatCard';
import { ExportButton } from '@/components/admin/ExportButton';
import { ProgressBar } from '@/components/admin/ProgressBar';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';

export default function PaymentReportsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
  const allTransactions = paymentTransactions || [];
  const report = paymentReport || {};

  // Pagination logic
  const totalItems = allTransactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const transactions = allTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, filterValues]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

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
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value="₹1,81,770"
          valueClassName="text-primary"
          change="+12.5%"
          trend="up"
          description="This month"
        />
        
        <StatCard
          icon={CreditCard}
          label="Online Payments"
          value={`₹${((report as any).onlineTotal || 0).toLocaleString('en-IN')}`}
          change="+15.3%"
          trend="up"
          description={`${(report as any).onlinePercentage || 0}% of total`}
        />
        
        <StatCard
          icon={Wallet}
          label="COD Payments"
          value={`₹${((report as any).codTotal || 0).toLocaleString('en-IN')}`}
          change="-5.2%"
          trend="down"
          description={`${(report as any).codPercentage || 0}% of total`}
        />
      </div>

      {/* Payment Methods Breakdown */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">Payment Methods Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {paymentMethods.map((payment, index) => {
              const Icon = payment.icon;
              return (
                <ProgressBar
                  key={payment.method}
                  percentage={payment.percentage}
                  color={payment.color}
                  height="sm"
                  label={payment.method}
                  value={`₹${payment.amount.toLocaleString()}`}
                  icon={Icon}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Recent High-Value Transactions</CardTitle>
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

          {allTransactions.length === 0 ? (
            <EmptyState
              icon={IndianRupee}
              title="No transactions found"
              description={search ? "Try adjusting your search or filters" : "No transactions yet"}
            />
          ) : (
          <>
          <div className="space-y-2.5 sm:space-y-3">
            {transactions.map((txn: any) => {
              const statusStyle = txn.status === 'Success' 
                ? 'border-2 text-green-600 dark:text-green-400'
                : 'border-2 text-yellow-600 dark:text-yellow-400';

              return (
                <TransactionCard
                  key={txn.id}
                  id={txn.id}
                  icon={IndianRupee}
                  primaryBadge={{
                    label: txn.id,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: txn.status,
                    className: statusStyle,
                  }}
                  title={txn.type}
                  subtitle={`${txn.method} • ${txn.date}`}
                  amount={txn.amount.toLocaleString()}
                  amountLabel="Amount"
                  onView={() => router.push(AdminRoutes.PAYMENT_DETAIL(txn.id))}
                  viewButtonText="View"
                />
              );
            })}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            className="mt-4 sm:mt-6"
          />
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
