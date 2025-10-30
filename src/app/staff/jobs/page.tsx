'use client';

import { useMemo, useState } from 'react';
import { JobCard } from '@/components/staff/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useStaffJobs } from '@/api/domains/staff';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/crud/Pagination';
import { debounce } from '@/lib/utils/formatters';

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const updateDebouncedSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 300), []);

  // Build filters based on active tab and user selections
  const filters = useMemo(() => {
    const baseFilters: any = {
      status: status as any,
      search: debouncedSearch || undefined,
      page,
      limit,
    };

    // Add date filtering for Today and Upcoming tabs
    // Only apply manual date filters on 'all' tab
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'today') {
      baseFilters.fromDate = today;
      baseFilters.toDate = today;
    } else if (activeTab === 'upcoming') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      baseFilters.fromDate = tomorrow.toISOString().split('T')[0];
    } else if (activeTab === 'all') {
      // Only apply manual date filters on 'all' tab
      baseFilters.fromDate = fromDate || undefined;
      baseFilters.toDate = toDate || undefined;
    }

    return baseFilters;
  }, [status, debouncedSearch, fromDate, toDate, page, limit, activeTab]);

  // Get counts for all tabs with search/status filters applied
  const todayDate = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  // Build count filters with search and status
  const countBaseFilters = {
    search: debouncedSearch || undefined,
    status: status as any,
    limit: 1000,
  };
  
  // Call all hooks before any conditional returns
  const { data, isLoading, isFetching, error } = useStaffJobs(filters);
  const loading = isLoading || isFetching;
  const { data: todayData } = useStaffJobs({ 
    ...countBaseFilters,
    fromDate: todayDate, 
    toDate: todayDate,
  });
  const { data: upcomingData } = useStaffJobs({ 
    ...countBaseFilters,
    fromDate: tomorrowDate,
  });
  const { data: allData } = useStaffJobs({ 
    ...countBaseFilters,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  
  const jobs = data?.data ?? [];
  const todayCount = todayData?.total ?? 0;
  const upcomingCount = upcomingData?.total ?? 0;
  const totalCount = allData?.total ?? 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          My Jobs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage your assigned service jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Today</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{todayCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Upcoming</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{upcomingCount}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{totalCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); setPage(1); }} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>All</span>
            <span>({totalCount})</span>
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Today</span>
            <span className="xs:hidden">Now</span>
            <span>({todayCount})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Upcoming</span>
            <span className="xs:hidden">Later</span>
            <span>({upcomingCount})</span>
          </TabsTrigger>
        </TabsList>

        {/* All - Filters and List */}
        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          {/* Filters - Only show on All tab */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by customer or service"
                value={search}
                onChange={(e) => { setSearch(e.target.value); updateDebouncedSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? undefined : v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
          </div>

          {/* List */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loading text="Loading jobs..." fullScreen={false} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <Error message="Failed to load jobs" details={error?.message} />
              </div>
            ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={{
                    id: job.id,
                    customer: job.customer,
                    service: job.service,
                    time: job.time,
                    address: job.location,
                    status: job.status
                  }} 
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title={debouncedSearch || status || fromDate || toDate ? 'No jobs match your filters' : 'No jobs found'}
              description={debouncedSearch || status || fromDate || toDate ? 'Try adjusting your search or filters to find jobs' : 'You have no assigned jobs at the moment'}
            />
          )}
          </div>

          {/* Pagination */}
          {jobs.length > 0 && (
            <Pagination
              currentPage={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={(p) => setPage(p)}
              itemsPerPage={data?.limit ?? limit}
              totalItems={data?.total ?? 0}
            />
          )}
        </TabsContent>

        {/* Today Jobs */}
        <TabsContent value="today" className="space-y-4 sm:space-y-6">
          {/* Search on Today tab */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by customer or service"
                value={search}
                onChange={(e) => { setSearch(e.target.value); updateDebouncedSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? undefined : v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loading text="Loading jobs..." fullScreen={false} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <Error message="Failed to load jobs" details={error?.message} />
              </div>
            ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={{
                    id: job.id,
                    customer: job.customer,
                    service: job.service,
                    time: job.time,
                    address: job.location,
                    status: job.status
                  }} 
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="No jobs scheduled today"
              description="Enjoy your free time!"
            />
          )}
          </div>
        </TabsContent>

        {/* Upcoming Jobs */}
        <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
          {/* Search on Upcoming tab */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Search by customer or service"
                value={search}
                onChange={(e) => { setSearch(e.target.value); updateDebouncedSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? undefined : v); setPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loading text="Loading jobs..." fullScreen={false} />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[400px]">
                <Error message="Failed to load jobs" details={error?.message} />
              </div>
            ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={{
                    id: job.id,
                    customer: job.customer,
                    service: job.service,
                    time: job.time,
                    address: job.location,
                    status: job.status
                  }} 
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming jobs"
              description="New jobs will appear here when assigned"
            />
          )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
