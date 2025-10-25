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
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const tickets = [
  { id: 'TKT001', customer: 'John Doe', email: 'john@example.com', subject: 'Payment Issue', priority: 'high', status: 'open', date: '2025-10-24' },
  { id: 'TKT002', customer: 'Priya Sharma', email: 'priya@example.com', subject: 'Service Query', priority: 'medium', status: 'in-progress', date: '2025-10-23' },
  { id: 'TKT003', customer: 'Amit Patel', email: 'amit@example.com', subject: 'Refund Request', priority: 'high', status: 'resolved', date: '2025-10-22' },
  { id: 'TKT004', customer: 'Rahul Kumar', email: 'rahul@example.com', subject: 'Booking Problem', priority: 'low', status: 'open', date: '2025-10-21' },
];

export default function TicketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}>
                <Ticket className="h-6 w-6" style={{ color: 'hsl(221 83% 53%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{tickets.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(30 80% 55% / 0.1)' }}>
                <AlertCircle className="h-6 w-6" style={{ color: 'hsl(30 80% 55%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(30 80% 55%)' }}>
              {openTickets}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(221 83% 53% / 0.1)' }}>
                <Clock className="h-6 w-6" style={{ color: 'hsl(221 83% 53%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{inProgressTickets}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}>
                <CheckCircle className="h-6 w-6" style={{ color: 'hsl(160 60% 45%)' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(160 60% 45%)' }}>
              {resolvedTickets}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
              <Ticket className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle>All Tickets</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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
            <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => {
                const priorityStyle = getPriorityStyle(ticket.priority);
                const statusStyle = getStatusStyle(ticket.status);
                
                return (
                  <Card key={ticket.id} className="border-2 border-border hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Left Section */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div 
                            className="p-3 rounded-xl flex-shrink-0"
                            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            <Ticket className="h-6 w-6" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
                              <Badge 
                                variant="outline"
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
                                style={{
                                  backgroundColor: statusStyle.backgroundColor,
                                  color: statusStyle.color,
                                  borderColor: statusStyle.borderColor
                                }}
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <p className="font-semibold text-foreground truncate">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {ticket.customer} • {ticket.email}
                            </p>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden md:block">
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-semibold text-foreground">{ticket.date}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
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
