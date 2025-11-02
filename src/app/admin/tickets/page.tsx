'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminTicketList } from '@/api/domains/admin-support/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { AdminRoutes } from '@/lib/constants/routes';

export default function TicketsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    priority: filterValues.priority || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: ticketsData, isLoading, error, refetch } = useAdminTicketList(filters);

  const tickets = ticketsData?.data || [];
  const totalItems = ticketsData?.total || 0;
  const totalPages = ticketsData?.totalPages || 0;
  const filteredTickets = tickets; // Already filtered by API

  if (isLoading) {
    return <Loading text="Loading tickets..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load tickets" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const openTickets = tickets.filter((t: any) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t: any) => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter((t: any) => t.status === 'resolved').length;

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-2 text-red-600 dark:text-red-400';
      case 'medium':
        return 'border-2 text-orange-600 dark:text-orange-400';
      case 'low':
        return 'border-2 text-blue-600 dark:text-blue-400';
      default:
        return 'border-2';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'border-2 text-orange-600 dark:text-orange-400';
      case 'in_progress':
        return 'border-2 text-blue-600 dark:text-blue-400';
      case 'resolved':
        return 'border-2 text-green-600 dark:text-green-400';
      default:
        return 'border-2';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Support Tickets
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage customer support requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Ticket}
          label="Total Tickets"
          value={totalItems}
          change="+7.5%"
          trend="up"
          description="All tickets"
        />
        
        <StatCard
          icon={AlertCircle}
          label="Open"
          value={openTickets}
          valueClassName="text-primary"
          change="+4.2%"
          trend="up"
          description="Needs attention"
        />
        
        <StatCard
          icon={Clock}
          label="In Progress"
          value={inProgressTickets}
          change="+2.8%"
          trend="up"
          description="Being handled"
        />
        
        <StatCard
          icon={CheckCircle}
          label="Resolved"
          value={resolvedTickets}
          valueClassName="text-primary"
          change="+18.3%"
          trend="up"
          description="Completed"
        />
      </div>

      {/* Tickets List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Tickets</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search tickets by number, customer, or subject..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Open', value: 'open' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Resolved', value: 'resolved' },
                ],
              },
              {
                label: 'Priority',
                value: 'priority',
                options: [
                  { label: 'All Priorities', value: '' },
                  { label: 'High', value: 'high' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Low', value: 'low' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No tickets found"
              description={search ? "Try adjusting your search or filters" : "No support tickets yet"}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredTickets.map((ticket) => (
                <TransactionCard
                  key={ticket.id}
                  id={ticket.id}
                  icon={Ticket}
                  layout="horizontal"
                  primaryBadge={{
                    label: ticket.ticketNumber,
                    variant: 'outline',
                    className: 'font-mono',
                  }}
                  statusBadge={{
                    label: ticket.status.replace('_', ' '),
                    className: `${getStatusClass(ticket.status)} capitalize`,
                  }}
                  title={ticket.subject}
                  subtitle={ticket.customerName}
                  amount={new Date(ticket.createdAt).toLocaleDateString()}
                  amountLabel="Created"
                  onView={() => router.push(AdminRoutes.TICKET_DETAIL(ticket.id))}
                  viewButtonText="View"
                  additionalContent={
                    <Badge 
                      variant="outline"
                      className={`text-xs capitalize ${getPriorityClass(ticket.priority)}`}
                    >
                      {ticket.priority} Priority
                    </Badge>
                  }
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredTickets.length > 0 && (
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
