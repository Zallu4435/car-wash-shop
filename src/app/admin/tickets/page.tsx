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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          backgroundColor: 'hsl(0 63% 55% / 0.1)',
          color: 'hsl(0 63% 55%)',
          borderColor: 'hsl(0 63% 55% / 0.3)'
        };
      case 'medium':
        return {
          backgroundColor: 'hsl(30 80% 55% / 0.1)',
          color: 'hsl(30 80% 55%)',
          borderColor: 'hsl(30 80% 55% / 0.3)'
        };
      case 'low':
        return {
          backgroundColor: 'hsl(221 83% 53% / 0.1)',
          color: 'hsl(221 83% 53%)',
          borderColor: 'hsl(221 83% 53% / 0.3)'
        };
      default:
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          borderColor: 'hsl(var(--border))'
        };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open':
        return {
          backgroundColor: 'hsl(30 80% 55% / 0.1)',
          color: 'hsl(30 80% 55%)',
          borderColor: 'hsl(30 80% 55% / 0.3)'
        };
      case 'in-progress':
        return {
          backgroundColor: 'hsl(221 83% 53% / 0.1)',
          color: 'hsl(221 83% 53%)',
          borderColor: 'hsl(221 83% 53% / 0.3)'
        };
      case 'resolved':
        return {
          backgroundColor: 'hsl(160 60% 45% / 0.1)',
          color: 'hsl(160 60% 45%)',
          borderColor: 'hsl(160 60% 45% / 0.3)'
        };
      default:
        return {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          borderColor: 'hsl(var(--border))'
        };
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <Ticket className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">All Tickets</CardTitle>
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
              {filteredTickets.map((ticket) => {
                const priorityStyle = getPriorityStyle(ticket.priority);
                const statusStyle = getStatusStyle(ticket.status);
                
                return (
                  <Card key={ticket.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                          <div 
                            className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            <Ticket className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                              <Badge variant="outline" className="font-mono text-xs">{ticket.ticketNumber}</Badge>
                              <Badge 
                                variant="outline"
                                className="text-xs capitalize"
                                style={{
                                  backgroundColor: priorityStyle.backgroundColor,
                                  color: priorityStyle.color,
                                  borderColor: priorityStyle.borderColor
                                }}
                              >
                                {ticket.priority}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className="text-xs capitalize"
                                style={{
                                  backgroundColor: statusStyle.backgroundColor,
                                  color: statusStyle.color,
                                  borderColor: statusStyle.borderColor
                                }}
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                              {ticket.subject}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {ticket.customerName}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:hidden">
                              Created: {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <div className="text-left sm:text-right hidden sm:block flex-1">
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-semibold text-sm text-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(AdminRoutes.TICKET_DETAIL(ticket.id))}
                            className="w-full sm:w-auto h-9 text-xs sm:text-sm"
                          >
                            <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline">View</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
