'use client';

import { useMemo, useState } from 'react';
import { JobCard } from '@/components/staff/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useStaffJobs } from '@/api/domains/staff/staff-index';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/crud/Pagination';
import { debounce } from '@/lib/utils/formatters';

export default function JobsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const updateDebouncedSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 300), []);

  const filters = useMemo(() => ({
    status: status as any,
    search: debouncedSearch || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page,
    limit,
  }), [status, debouncedSearch, fromDate, toDate, page, limit]);

  const { data } = useStaffJobs(filters);
  const jobs = data?.data ?? [];
  const todayDate = new Date().toISOString().split('T')[0];
  const todayJobs = jobs.filter(job => (job.datetime || '').startsWith(todayDate));
  const upcomingJobs = jobs.filter(job => (job.datetime || '').split('T')[0] > todayDate);

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
            <p className="text-xl sm:text-2xl font-bold text-foreground">{todayJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Upcoming</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{upcomingJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{jobs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="all" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>All</span>
            <span>({data?.total ?? 0})</span>
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Today</span>
            <span className="xs:hidden">Now</span>
            <span>({todayJobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Upcoming</span>
            <span className="xs:hidden">Later</span>
            <span>({upcomingJobs.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* All - Filters and List */}
        <TabsContent value="all" className="space-y-4 sm:space-y-6">
          {/* Filters */}
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
          {jobs.length > 0 ? (
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
            <Card className="border-2 border-border">
              <CardContent className="py-10 sm:py-12 text-center">
                <p className="text-base sm:text-lg font-semibold text-foreground mb-1 px-4">
                  No jobs found
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={data?.page ?? page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => setPage(p)}
            itemsPerPage={data?.limit ?? limit}
            totalItems={data?.total ?? jobs.length}
          />
        </TabsContent>

        {/* Today Jobs */}
        <TabsContent value="today">
          {todayJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {todayJobs.map((job) => (
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
            <Card className="border-2 border-border">
              <CardContent className="py-10 sm:py-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
                  <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-1 px-4">
                  No jobs scheduled today
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground px-4">
                  Enjoy your free time!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Jobs */}
        <TabsContent value="upcoming">
          {upcomingJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {upcomingJobs.map((job) => (
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
            <Card className="border-2 border-border">
              <CardContent className="py-10 sm:py-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full mb-3 sm:mb-4">
                  <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-1 px-4">
                  No upcoming jobs
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground px-4">
                  New jobs will appear here when assigned
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
