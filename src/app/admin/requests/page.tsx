'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminBookingList } from '@/api/domains/admin-requests/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { StatCard } from '@/components/admin/StatCard';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { AdminRoutes } from '@/lib/constants/routes';

export default function RequestsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    dateRange: filterValues.dateRange || undefined,
    page,
    limit: pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: bookingData, isLoading, error, refetch} = useAdminBookingList(filters);

  const bookings = bookingData?.data || [];
  const totalItems = bookingData?.total || 0;
  const totalPages = bookingData?.totalPages || 0;
  const filteredBookings = bookings; // Already filtered by API

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const inProgressCount = bookings.filter(b => b.status === 'in_progress').length;
  const completedToday = bookings.filter(b => b.status === 'completed').length;

  if (isLoading) {
    return <Loading text="Loading bookings..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load bookings" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const statusVariants = {
    pending: 'secondary' as const,
    'in-progress': 'default' as const,
    completed: 'default' as const,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Service Requests
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage service bookings and assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Calendar}
          label="Total Bookings"
          value={bookings.length}
          change="+10.5%"
          trend="up"
          description="This month"
        />
        
        <StatCard
          icon={Clock}
          label="Pending"
          value={pendingCount}
          valueClassName="text-primary"
          change="+5.2%"
          trend="up"
          description="Awaiting assignment"
        />
        
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={inProgressCount}
          change="+8.7%"
          trend="up"
          description="Active bookings"
        />
        
        <StatCard
          icon={CheckCircle}
          label="Completed Today"
          value={completedToday}
          valueClassName="text-primary"
          change="+12.3%"
          trend="up"
          description="Successfully completed"
        />
      </div>

      {/* Bookings List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Service Bookings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search by booking ID, customer name, or service..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
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
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No bookings found"
              description={search ? "Try adjusting your search or filters" : "No service bookings yet"}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredBookings.map((booking) => {
              const statusVariant = statusVariants[booking.status as keyof typeof statusVariants] || 'secondary';
              return (
                <TransactionCard
                  key={booking.id}
                  id={booking.id}
                  icon={Calendar}
                  primaryBadge={{
                    label: booking.id,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: booking.status,
                    className: '',
                  }}
                  title={booking.customer}
                  subtitle={booking.service}
                  onView={() => router.push(AdminRoutes.REQUEST_DETAIL(booking.id))}
                  viewButtonText="View Details"
                  additionalContent={
                    <div className="mt-2 pt-2 border-t border-border md:hidden">
                      <p className="text-xs text-muted-foreground">
                        {booking.date} • {booking.time}
                      </p>
                    </div>
                  }
                />
              );
            })}
            </div>
          )}
          
          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1); // Reset to first page when changing page size
              }}
              className="mt-4 sm:mt-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
