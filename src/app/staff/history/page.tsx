'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Calendar, 
  DollarSign, 
  User, 
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { useStaffWorkHistory } from '@/api/domains/staff';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/crud/Pagination';
import React, { useMemo } from 'react';
import { debounce } from '@/lib/utils/formatters';

export default function StaffHistoryPage() {
  const [status, setStatus] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  
  const updateDebouncedSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 300), []);

  const filters = useMemo(() => ({
    status: status === 'all' ? undefined : (status as any),
    search: debouncedSearch || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page,
    limit,
  }), [status, debouncedSearch, fromDate, toDate, page, limit]);

  // Call all hooks before any conditional returns
  const { data, isLoading, error } = useStaffWorkHistory(filters);
  const { data: allHistoryData } = useStaffWorkHistory({ limit: 1000 });

  const jobs = data ?? [];
  const allJobs = allHistoryData ?? [];
  const completedJobs = allJobs.filter(j => j.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.amount ?? 0), 0);
  const averageRating = completedJobs.length > 0 
    ? (completedJobs.reduce((sum, job) => sum + (job.rating ?? 0), 0) / completedJobs.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Job History
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Track your completed and cancelled jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{completedJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Earned</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">₹{totalEarnings}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-950/30 rounded-lg">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{averageRating} ⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by customer or service"
            value={search}
            onChange={(e) => { setSearch(e.target.value); updateDebouncedSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
        <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
      </div>

      {/* History List */}
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loading text="Loading work history..." fullScreen={false} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <Error message="Failed to load work history" details={error?.message} />
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow border-2 border-border">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                      {/* Left Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {job.id}
                          </Badge>
                          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {job.status}
                          </Badge>
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <p className="font-semibold text-sm sm:text-base text-foreground truncate">{job.customer}</p>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{job.service}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span>{(job.datetime || '').split('T')[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
                        <div className="text-left md:text-right">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Earned</p>
                          <p className="text-xl sm:text-2xl font-bold text-primary">₹{job.amount ?? 0}</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm flex-shrink-0 cursor-pointer">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title={debouncedSearch || status !== 'all' || fromDate || toDate ? 'No history matches your filters' : 'No work history yet'}
                description={debouncedSearch || status !== 'all' || fromDate || toDate ? 'Try adjusting your search or filters' : 'Completed jobs will appear here'}
              />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {jobs.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(jobs.length / limit)}
            onPageChange={setPage}
            itemsPerPage={limit}
            totalItems={jobs.length}
          />
        )}
      </div>
    </div>
  );
}
