'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Search, 
  Eye,
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Bookings List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Service Bookings</CardTitle>
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
                <Card key={booking.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {booking.id}
                            </Badge>
                            <Badge variant={statusVariant} className="text-xs capitalize">
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-foreground truncate">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {booking.service}
                          </p>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                          <p className="font-semibold text-foreground">{booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/requests/${booking.id}`)}
                          className="h-9 text-xs sm:text-sm"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {booking.id}
                            </Badge>
                            <Badge variant={statusVariant} className="text-xs capitalize">
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {booking.customer}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {booking.service}
                          </p>
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              {booking.date} • {booking.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/requests/${booking.id}`)}
                        className="w-full h-9 text-xs sm:text-sm"
                      >
                        <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
