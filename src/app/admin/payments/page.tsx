'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  Package,
  Car,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CountUp } from '@/components/ui/count-up';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  usePayments,
  usePaymentsSummary,
  usePaymentsAnalytics,
  type PaymentFilters,
  type PaymentItem,
} from '@/api/domains/admin-payments/queries';

const PRESET_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

const PAYMENT_STATUSES = ['paid', 'pending', 'refunded', 'failed'];
const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'order', label: 'Product Orders' },
  { value: 'booking', label: 'Service Bookings' },
];

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFilters>({
    preset: 'month',
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState('');

  // Build API filters
  const apiFilters = useMemo(() => ({
    ...filters,
    search: searchInput || undefined,
  }), [filters, searchInput]);

  // Queries
  const paymentsQuery = usePayments(apiFilters);
  const summaryQuery = usePaymentsSummary(apiFilters);
  const analyticsQuery = usePaymentsAnalytics({ preset: filters.preset });

  const isLoading = paymentsQuery.isLoading || summaryQuery.isLoading;
  const error = paymentsQuery.error || summaryQuery.error;

  // Handlers
  const handlePresetChange = (preset: string) => {
    setFilters(prev => ({
      ...prev,
      preset: preset as PaymentFilters['preset'],
      startDate: undefined,
      endDate: undefined,
      page: 1,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
    }));
  };

  const handleTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: type === 'all' ? undefined : type as 'order' | 'booking',
      page: 1,
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({ preset: 'month', page: 1, limit: 10 });
    setSearchInput('');
  };

  const hasActiveFilters = filters.status || filters.type || searchInput;

  // Prepare pie chart data for payment status
  const statusPieData = useMemo(() => {
    if (!summaryQuery.data) return [];
    return [
      { name: 'Paid', value: summaryQuery.data.paidCount, color: PIE_COLORS[0] },
      { name: 'Pending', value: summaryQuery.data.pendingCount, color: PIE_COLORS[1] },
      { name: 'Refunded', value: summaryQuery.data.refundedCount, color: PIE_COLORS[2] },
    ].filter(item => item.value > 0);
  }, [summaryQuery.data]);

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Payments
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all transactions from orders and service bookings.
          </p>
        </div>
        <Select value={filters.preset || 'month'} onValueChange={handlePresetChange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {PRESET_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">Failed to load payment data</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && summaryQuery.data && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Revenue"
              value={summaryQuery.data.totalRevenue}
              prefix="₹"
              icon={DollarSign}
              color="bg-green-500"
            />
            <SummaryCard
              title="Transactions"
              value={summaryQuery.data.totalTransactions}
              icon={CreditCard}
              color="bg-blue-500"
              subtitle={`${summaryQuery.data.orderCount} orders · ${summaryQuery.data.bookingCount} bookings`}
            />
            <SummaryCard
              title="Average Value"
              value={summaryQuery.data.averageValue}
              prefix="₹"
              icon={TrendingUp}
              color="bg-purple-500"
            />
            <SummaryCard
              title="Refunds"
              value={summaryQuery.data.refundedAmount}
              prefix="₹"
              icon={ArrowDownRight}
              color="bg-red-500"
              subtitle={`${summaryQuery.data.refundedCount} transactions`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Revenue Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Orders and bookings revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {analyticsQuery.data?.revenueData && analyticsQuery.data.revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsQuery.data.revenueData}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                      <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      />
                      <Area type="monotone" dataKey="orders" name="Orders" stroke="#8884d8" fillOpacity={1} fill="url(#colorOrders)" />
                      <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#82ca9d" fillOpacity={1} fill="url(#colorBookings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Status Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {statusPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {PAYMENT_STATUSES.map(status => (
                        <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[200px] space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Search</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by transaction ID, phone..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} size="icon" variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="gap-2 text-muted-foreground">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Showing {paymentsQuery.data?.payments.length || 0} of {paymentsQuery.data?.pagination.total || 0} transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Transaction ID</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Reference</th>
                    <th className="p-3 text-left font-medium">Customer</th>
                    <th className="p-3 text-left font-medium">Amount</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paymentsQuery.data?.payments.map((payment) => (
                    <PaymentRow key={`${payment.type}-${payment.id}`} payment={payment} />
                  ))}
                  {paymentsQuery.data?.payments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {paymentsQuery.data && paymentsQuery.data.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={paymentsQuery.data.pagination.page}
                  totalPages={paymentsQuery.data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Sub-components

function SummaryCard({
  title,
  value,
  prefix = '',
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: number;
  prefix?: string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              <CountUp end={value} prefix={prefix} duration={1500} separator="," />
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-full', color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentRow({ payment }: { payment: PaymentItem }) {
  const isOrder = payment.type === 'order';
  const detailLink = isOrder
    ? `/admin/orders/${payment.referenceId}`
    : `/admin/requests/${payment.referenceId}`;

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-xs">
        {payment.transactionId ? (
          <span className="text-primary">{payment.transactionId}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {isOrder ? (
            <Package className="h-4 w-4 text-blue-500" />
          ) : (
            <Car className="h-4 w-4 text-green-500" />
          )}
          <span className="capitalize">{payment.type}</span>
        </div>
      </td>
      <td className="p-3">
        <Link href={detailLink} className="flex items-center gap-1 text-primary hover:underline">
          {payment.referenceNumber}
          <ExternalLink className="h-3 w-3" />
        </Link>
        {payment.serviceName && (
          <div className="text-xs text-muted-foreground">{payment.serviceName}</div>
        )}
      </td>
      <td className="p-3">
        <div>
          <div className="font-medium">{payment.customerName}</div>
          <div className="text-xs text-muted-foreground">{payment.customerPhone}</div>
        </div>
      </td>
      <td className="p-3 font-medium">
        ₹{payment.amount.toLocaleString()}
        {payment.paymentType === 'advance' && payment.totalAmount && (
          <div className="text-xs text-muted-foreground">
            of ₹{payment.totalAmount.toLocaleString()}
          </div>
        )}
      </td>
      <td className="p-3">
        <StatusBadge status={payment.paymentStatus} />
      </td>
      <td className="p-3 text-muted-foreground">
        {new Date(payment.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'paid':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'refunded':
        return 'bg-red-500 text-white';
      case 'failed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Badge className={cn('capitalize font-normal', getColor(status))}>
      {status}
    </Badge>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
