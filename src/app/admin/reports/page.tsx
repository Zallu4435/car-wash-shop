'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  Package,
  Car,
  TrendingUp,
  DollarSign,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useOrdersReport,
  useBookingsReport,
  useOrdersSummary,
  useBookingsSummary,
  adminReportsFetchers,
  type ReportFilters,
  type OrderReportItem,
  type BookingReportItem,
} from '@/api/domains/admin-reports/queries';
import { CountUp } from '@/components/ui/count-up';

type SortDirection = 'asc' | 'desc';
type ReportType = 'orders' | 'bookings';

const ORDER_STATUSES = ['pending', 'processing', 'confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed', 'couldnt_reach'];
const PAYMENT_STATUSES = ['pending', 'paid', 'refunded', 'failed'];

const PRESET_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('orders');
  const [filters, setFilters] = useState<ReportFilters>({
    preset: 'month',
    page: 1,
    limit: 20,
  });
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortDirection>('desc');

  // Build API filters
  const apiFilters = useMemo(() => ({
    ...filters,
    search: searchInput || undefined,
    sortBy,
    sortOrder,
  }), [filters, searchInput, sortBy, sortOrder]);

  // Queries
  const ordersQuery = useOrdersReport(reportType === 'orders' ? apiFilters : {});
  const bookingsQuery = useBookingsReport(reportType === 'bookings' ? apiFilters : {});
  const ordersSummaryQuery = useOrdersSummary(reportType === 'orders' ? apiFilters : {});
  const bookingsSummaryQuery = useBookingsSummary(reportType === 'bookings' ? apiFilters : {});

  const isLoading = reportType === 'orders'
    ? ordersQuery.isLoading || ordersSummaryQuery.isLoading
    : bookingsQuery.isLoading || bookingsSummaryQuery.isLoading;

  const error = reportType === 'orders'
    ? ordersQuery.error || ordersSummaryQuery.error
    : bookingsQuery.error || bookingsSummaryQuery.error;

  // Handlers
  const handlePresetChange = (preset: string) => {
    setFilters(prev => ({
      ...prev,
      preset: preset as ReportFilters['preset'],
      startDate: undefined,
      endDate: undefined,
      page: 1,
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      preset: undefined,
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

  const handlePaymentStatusChange = (paymentStatus: string) => {
    setFilters(prev => ({
      ...prev,
      paymentStatus: paymentStatus === 'all' ? undefined : paymentStatus,
      page: 1,
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleExportPdf = () => {
    if (reportType === 'orders') {
      adminReportsFetchers.exportOrdersPdf(apiFilters);
    } else {
      adminReportsFetchers.exportBookingsPdf(apiFilters);
    }
  };

  const handleExportCsv = () => {
    if (reportType === 'orders') {
      adminReportsFetchers.exportOrdersCsv(apiFilters);
    } else {
      adminReportsFetchers.exportBookingsCsv(apiFilters);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearFilters = () => {
    setFilters({ preset: 'all', page: 1, limit: 20 });
    setSearchInput('');
  };

  const hasActiveFilters = filters.status || filters.paymentStatus || searchInput || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and export detailed reports for orders and bookings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCsv}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <Tabs value={reportType} onValueChange={(v) => setReportType(v as ReportType)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-2">
            <Car className="h-4 w-4" />
            Bookings
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Filters Row */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Preset Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Quick Filters</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_OPTIONS.map(preset => (
                  <Button
                    key={preset.value}
                    variant={filters.preset === preset.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetChange(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="flex gap-2 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">From</label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">To</label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          {/* Status and Search Row */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {(reportType === 'orders' ? ORDER_STATUSES : BOOKING_STATUSES).map(status => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Payment</label>
              <Select value={filters.paymentStatus || 'all'} onValueChange={handlePaymentStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  {PAYMENT_STATUSES.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder={reportType === 'orders' ? 'Search by order number or phone...' : 'Search by service or phone...'}
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

      {/* Summary Cards */}
      {reportType === 'orders' && ordersSummaryQuery.data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Orders"
            value={ordersSummaryQuery.data.totalCount}
            icon={Package}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Total Revenue"
            value={ordersSummaryQuery.data.totalRevenue}
            prefix="₹"
            icon={DollarSign}
            color="bg-green-500"
          />
          <SummaryCard
            title="Avg Order Value"
            value={ordersSummaryQuery.data.avgOrderValue}
            prefix="₹"
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <SummaryCard
            title="Total Discount"
            value={ordersSummaryQuery.data.totalDiscount}
            prefix="₹"
            icon={Users}
            color="bg-orange-500"
          />
        </div>
      )}

      {reportType === 'bookings' && bookingsSummaryQuery.data && (
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Bookings"
            value={bookingsSummaryQuery.data.totalCount}
            icon={Car}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Total Revenue"
            value={bookingsSummaryQuery.data.totalRevenue}
            prefix="₹"
            icon={DollarSign}
            color="bg-green-500"
          />
          <SummaryCard
            title="Avg Booking Value"
            value={bookingsSummaryQuery.data.avgBookingValue}
            prefix="₹"
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">Failed to load report data</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* Orders Table */}
      {reportType === 'orders' && ordersQuery.data && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Orders Report</CardTitle>
            <CardDescription>
              Showing {ordersQuery.data.orders.length} of {ordersQuery.data.pagination.total} orders
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <SortableHeader column="orderNumber" label="Order #" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader column="customerName" label="Customer" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Email</th>
                  <SortableHeader column="createdAt" label="Date" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Items</th>
                  <th className="p-3 text-left font-medium">Payment Method</th>
                  <SortableHeader column="totalAmount" label="Total" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ordersQuery.data.orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={ordersQuery.data.pagination.page}
              totalPages={ordersQuery.data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      {reportType === 'bookings' && bookingsQuery.data && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Bookings Report</CardTitle>
            <CardDescription>
              Showing {bookingsQuery.data.bookings.length} of {bookingsQuery.data.pagination.total} bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">ID</th>
                  <SortableHeader column="customerName" label="Customer" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader column="serviceName" label="Service" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Vehicle</th>
                  <SortableHeader column="scheduledAt" label="Scheduled" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader column="amount" label="Amount" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Payment Type</th>
                  <SortableHeader column="status" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-3 text-left font-medium">Payment</th>
                  <th className="p-3 text-left font-medium">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookingsQuery.data.bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={bookingsQuery.data.pagination.page}
              totalPages={bookingsQuery.data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
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
}: {
  title: string;
  value: number;
  prefix?: string;
  icon: React.ElementType;
  color: string;
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
          </div>
          <div className={cn('p-3 rounded-full', color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SortableHeader({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
}: {
  column: string;
  label: string;
  sortBy: string;
  sortOrder: SortDirection;
  onSort: (column: string) => void;
}) {
  const isActive = sortBy === column;

  return (
    <th
      className="p-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          sortOrder === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ChevronDown className="h-4 w-4 opacity-30" />
        )}
      </div>
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'delivered':
      case 'completed':
      case 'paid':
        return 'bg-green-500 text-white';
      case 'processing':
      case 'confirmed':
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Badge className={cn('capitalize font-normal', getColor(status))}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

function OrderRow({ order }: { order: OrderReportItem }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{order.orderNumber || order.id.slice(-8)}</td>
      <td className="p-3">
        <div>
          <div className="font-medium">{order.customerName}</div>
          <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
        </div>
      </td>
      <td className="p-3 text-muted-foreground">{order.customerEmail}</td>
      <td className="p-3 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
      <td className="p-3">{order.itemsCount}</td>
      <td className="p-3 capitalize">{order.paymentMethod}</td>
      <td className="p-3 font-medium">₹{order.totalAmount.toLocaleString()}</td>
      <td className="p-3"><StatusBadge status={order.status} /></td>
      <td className="p-3"><StatusBadge status={order.paymentStatus} /></td>
    </tr>
  );
}

function BookingRow({ booking }: { booking: BookingReportItem }) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{booking.id.slice(-8)}</td>
      <td className="p-3">
        <div>
          <div className="font-medium">{booking.customerName}</div>
          <div className="text-xs text-muted-foreground">{booking.customerPhone}</div>
        </div>
      </td>
      <td className="p-3">{booking.serviceName}</td>
      <td className="p-3 text-muted-foreground capitalize">
        {booking.vehicleCategory} {booking.vehicleBodyType}
      </td>
      <td className="p-3 text-muted-foreground">{new Date(booking.scheduledAt).toLocaleDateString()}</td>
      <td className="p-3 font-medium">₹{booking.amount.toLocaleString()}</td>
      <td className="p-3 capitalize">{booking.paymentType}</td>
      <td className="p-3"><StatusBadge status={booking.status} /></td>
      <td className="p-3"><StatusBadge status={booking.paymentStatus} /></td>
      <td className="p-3 text-muted-foreground">{booking.staffName}</td>
    </tr>
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
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (showEllipsisStart) {
    pages.push(1);
    if (currentPage > 4) pages.push('...');
  }

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pages.push(i);
  }

  if (showEllipsisEnd) {
    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages);
  }

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
      <div className="flex gap-1">
        {pages.map((page, i) => (
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-3 py-1">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="w-10"
            >
              {page}
            </Button>
          )
        ))}
      </div>
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
