'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, FileText, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTickets } from '@/api/domains/support/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { CustomerRoutes } from '@/lib/constants/routes';

export default function ComplaintsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch tickets from API
  const { data: tickets, isLoading, error, refetch } = useTickets();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { label: 'In Progress', variant: 'secondary' as const, icon: Clock };
      case 'resolved':
        return { label: 'Resolved', variant: 'success' as const, icon: CheckCircle2 };
      case 'open':
        return { label: 'Open', variant: 'warning' as const, icon: AlertCircle };
      case 'closed':
        return { label: 'Closed', variant: 'default' as const, icon: CheckCircle2 };
      default:
        return { label: 'Open', variant: 'default' as const, icon: AlertCircle };
    }
  };

  // Filter only complaint tickets
  const complaints = (tickets || []).filter(ticket => ticket.topic === 'complaint');

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return <Loading text="Loading complaints..." />;
  }

  // Error state
  if (error) {
    return <Error message="Failed to load complaints" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <Link href={CustomerRoutes.SUPPORT}>
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to Support</span>
            </Button>
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                  My Complaints
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  Track and manage your complaints
                </p>
              </div>
            </div>
            <Button asChild className="shadow-md h-9 sm:h-10 text-xs sm:text-sm flex-shrink-0">
              <Link href={CustomerRoutes.COMPLAINTS}>
                <AlertCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                New Complaint
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 sm:py-6 border-b border-border bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by complaint ID, order ID, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Complaints List */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {filteredComplaints.length === 0 ? (
            <Card className="border-2">
              <CardContent>
                <EmptyState
                  icon={FileText}
                  title="No Complaints Found"
                  description={
                    searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : "You haven't submitted any complaints yet"
                  }
                  action={
                    !searchQuery && statusFilter === 'all' ? (
                      <Button asChild>
                        <Link href={CustomerRoutes.COMPLAINTS}>Submit a Complaint</Link>
                      </Button>
                    ) : undefined
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const statusConfig = getStatusConfig(complaint.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card 
                    key={complaint.id} 
                    className="border-2 hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => router.push(CustomerRoutes.COMPLAINT_DETAIL(complaint.id))}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                                  {complaint.subject}
                                </h3>
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                  {complaint.id}
                                </Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Priority: <span className="font-medium text-foreground capitalize">{complaint.priority}</span>
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground pl-11">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span className="capitalize">{complaint.topic}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <Badge variant={statusConfig.variant} className="flex-shrink-0 self-start">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Results Count */}
          {filteredComplaints.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredComplaints.length} of {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
