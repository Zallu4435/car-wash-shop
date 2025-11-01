'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IndianRupee, Calendar, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { useStaffPaymentSummary } from '@/api/domains/staff';
import { StaffRoutes } from '@/lib/constants/routes';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';

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
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading, error } = useStaffPaymentSummary();
  const totalEarnings = data?.totalEarnings ?? 0;
  const pendingAmount = data?.pendingPayments ?? 0;
  const totalJobs = data?.history?.length ?? 0;

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    let payments = data?.history ?? [];

    // Search filter
    if (search) {
      payments = payments.filter((payment) =>
        payment.service?.toLowerCase().includes(search.toLowerCase()) ||
        payment.jobId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter - payments don't have status field in current data structure
    // Keeping filter state for future use

    // Date range filter
    if (fromDate) {
      payments = payments.filter((payment) => payment.date >= fromDate);
    }
    if (toDate) {
      payments = payments.filter((payment) => payment.date <= toDate);
    }

    return payments;
  }, [data?.history, search, status, fromDate, toDate]);

  // Paginate payments client-side
  const paginatedPayments = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, page, limit]);

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / limit);

  if (isLoading) {
    return <Loading text="Loading payments..." />;
  }

  if (error) {
    return <Error message="Failed to load payments" details={error?.message} />;
  }

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={IndianRupee}
          label="Total Earnings"
          value={`₹${totalEarnings.toLocaleString()}`}
          description="This Month"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={`₹${pendingAmount.toLocaleString()}`}
          description="To Receive"
        />
        <StatCard
          icon={Briefcase}
          label="Jobs"
          value={totalJobs}
          description="Completed"
          className="col-span-2 md:col-span-1"
        />
      </div>

      {/* Filters */}
      <SearchFilter
        searchPlaceholder="Search by service or job ID"
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        filterOptions={[
          {
            label: 'Status',
            value: 'status',
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
            ],
          },
          {
            label: 'Date Range',
            value: 'dateRange',
            type: 'dateRange',
            options: [
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
            ],
          },
        ]}
        onFilterChange={(filters) => {
          if (filters.status) {
            setStatus(filters.status);
          } else {
            setStatus('all');
          }
          
          // Handle date range
          if (filters.dateRange && filters.dateRange.includes('_')) {
            const [from, to] = filters.dateRange.split('_');
            setFromDate(from);
            setToDate(to);
          } else {
            setFromDate('');
            setToDate('');
          }
          
          setPage(1);
        }}
      />

      {/* Payment History */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Payment History</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {filteredPayments.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedPayments.length > 0 ? (
          <div className="space-y-3">
            {paginatedPayments.map((payment) => {
              const status = statusConfig['paid'];
              return (
                <Card key={`${payment.date}-${payment.amount}`} className="hover:shadow-md transition-shadow border-2 border-border">
                  <CardContent className="p-3 sm:p-4">
                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
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
                            <span>{payment.service ? 1 : 0} jobs</span>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs sm:text-sm cursor-pointer border-2"
                          onClick={() => router.push(StaffRoutes.PAYMENT_DETAIL(payment.date))}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="font-mono text-xs">
                            {payment.jobId ?? payment.service ?? 'PAY'}
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
                          <span>{payment.service ? 1 : 0} jobs</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full h-8 text-xs cursor-pointer border-2"
                        onClick={() => router.push(StaffRoutes.PAYMENT_DETAIL(payment.date))}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          ) : (
            <EmptyState
              icon={IndianRupee}
              title={search || status !== 'all' || fromDate || toDate ? 'No payments match your filters' : 'No payment history yet'}
              description={search || status !== 'all' || fromDate || toDate ? 'Try adjusting your search or filters' : 'Payment records will appear here'}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setLimit(newSize);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
