'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Ticket, 
  Search, 
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

export default function TicketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { data: ticketsData, isLoading, error, refetch } = useAdminTicketList();

  const tickets = ticketsData || [];

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

  const filteredTickets = useMemo(() => tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }), [tickets, searchQuery, statusFilter, priorityFilter]);

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

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
        {[
          { icon: Ticket, color: 'hsl(221 83% 53%)', label: 'Total Tickets', value: tickets.length },
          { icon: AlertCircle, color: 'hsl(30 80% 55%)', label: 'Open', value: openTickets, isHighlight: true },
          { icon: Clock, color: 'hsl(221 83% 53%)', label: 'In Progress', value: inProgressTickets },
          { icon: CheckCircle, color: 'hsl(160 60% 45%)', label: 'Resolved', value: resolvedTickets, isHighlight: true },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0" style={{ backgroundColor: `${stat.color} / 0.1` }}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.isHighlight ? '' : 'text-foreground'}`} style={stat.isHighlight ? { color: stat.color } : {}}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
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
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-10 sm:py-12 bg-muted/30 rounded-lg sm:rounded-xl border-2 border-dashed border-border">
              <Ticket className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">No tickets found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
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
                              <Badge variant="outline" className="font-mono text-xs">{ticket.id}</Badge>
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
                              {ticket.customer} • {ticket.email}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:hidden">
                              Created: {ticket.date}
                            </p>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <div className="text-left sm:text-right hidden sm:block flex-1">
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-semibold text-sm text-foreground">{ticket.date}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
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
        </CardContent>
      </Card>
    </div>
  );
}
