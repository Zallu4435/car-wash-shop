'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Wallet,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Banknote,
  Navigation,
  RefreshCw,
  CalendarCheck,
  TrendingUp
} from 'lucide-react';

import { useStaffJobs } from '@/api/domains/staff';
import { useStaffPayments, useStaffPaymentsSummary } from '@/api/domains/staff';
import Loading from '@/components/shared/display/Loading';
import { useRouter } from 'next/navigation';
import { StaffRoutes } from '@/lib/constants/routes';
import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

export default function StaffDashboardPage() {
  const router = useRouter();

  // Get today's date
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Fetch today's jobs (not completed/cancelled) - sorted by scheduled time
  const { data: jobsData, isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useStaffJobs({
    fromDate: today,
    toDate: today,
    limit: 10,
  });

  // Fetch today's payment collections
  const { data: paymentsData, isLoading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = useStaffPayments(today);

  // Fetch payment summary for pending handovers
  const { data: paymentSummary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useStaffPaymentsSummary(7);

  // Find next job (first non-completed, non-cancelled job)
  const nextJob = useMemo(() => {
    if (!jobsData?.data) return null;
    return jobsData.data.find(job =>
      !['completed', 'cancelled', 'couldnt_reach'].includes(job.status)
    );
  }, [jobsData]);

  // Calculate pending handover amount (cash only, not yet handed over)
  const pendingHandover = useMemo(() => {
    if (!paymentSummary) return { amount: 0, days: 0 };
    const pending = paymentSummary.filter(s => s.handoverStatus === 'pending' && s.cash > 0);
    const totalAmount = pending.reduce((sum, s) => sum + s.cash, 0);
    return { amount: totalAmount, days: pending.length };
  }, [paymentSummary]);

  // Today's stats
  const todayStats = useMemo(() => {
    if (!jobsData?.data) return { total: 0, completed: 0, pending: 0 };
    const jobs = jobsData.data;
    return {
      total: jobs.length,
      completed: jobs.filter(j => j.status === 'completed').length,
      pending: jobs.filter(j => !['completed', 'cancelled', 'couldnt_reach'].includes(j.status)).length,
    };
  }, [jobsData]);

  const isLoading = jobsLoading && paymentsLoading && summaryLoading;

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  // Helper to render error card
  const renderErrorCard = (title: string, error: Error | null, onRetry: () => void) => (
    <Card className="border-l-4 border-l-destructive shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-destructive mb-1 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{error?.message || 'Failed to load'}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRetry} className="cursor-pointer h-8 text-xs">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-1 pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
        </h1>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <CalendarCheck className="w-4 h-4" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid - Clean & Minimal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Jobs */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Jobs Today</p>
              <div className="text-3xl font-bold">{todayStats.total}</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
              <div className="text-3xl font-bold text-green-600 dark:text-green-500">{todayStats.completed}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">{todayStats.pending}</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Next Job Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Up Next
            </h2>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => router.push(StaffRoutes.JOBS)}>
              View Schedule
            </Button>
          </div>

          {jobsError ? (
            renderErrorCard('Failed to load jobs', jobsError as Error, refetchJobs)
          ) : (
            <Card className="shadow-md border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-0">
                {nextJob ? (
                  <>
                    <div className="p-6 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="bg-background text-foreground font-medium px-3 py-1">
                          {nextJob.time}
                        </Badge>
                        <Badge className={cn(
                          "font-medium",
                          nextJob.status === 'confirmed' ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" : "bg-secondary text-secondary-foreground"
                        )}>
                          {nextJob.status}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-1">{nextJob.service}</h3>
                      <p className="text-muted-foreground mb-6 text-sm">for {nextJob.customer}</p>

                      <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg text-sm text-foreground/80">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span className="leading-snug">{nextJob.location}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 border-t flex justify-end">
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => router.push(StaffRoutes.JOB_DETAIL(nextJob.id))}
                      >
                        Start Job <Navigation className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
                    <div className="bg-muted p-3 rounded-full mb-3">
                      <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">No jobs pending</h3>
                    <p className="text-muted-foreground text-sm">
                      You're all caught up for today!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Finance Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" />
              Finance
            </h2>
            <Button variant="link" size="sm" className="h-auto p-0" onClick={() => router.push(StaffRoutes.PAYMENTS)}>
              View History
            </Button>
          </div>

          {(paymentsError || summaryError) ? (
            renderErrorCard('Failed to load payments', (paymentsError || summaryError) as Error, () => { refetchPayments(); refetchSummary(); })
          ) : (
            <div className="space-y-4">
              {/* Cash In Hand Card */}
              <Card className={cn(
                "shadow-sm transition-all border overflow-hidden relative",
                pendingHandover.amount > 0
                  ? "border-blue-200 dark:border-blue-800"
                  : "border-border"
              )}>
                {pendingHandover.amount > 0 && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                )}
                <CardContent className="p-5 pl-7">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-muted-foreground">Cash In Hand</p>
                        {pendingHandover.amount > 0 && (
                          <Badge className="text-[10px] h-5 px-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 shadow-none border">
                            Submit Required
                          </Badge>
                        )}
                      </div>
                      <div className={cn(
                        "text-3xl font-bold tracking-tight",
                        pendingHandover.amount > 0 ? "text-blue-600 dark:text-blue-500" : "text-foreground"
                      )}>
                        ₹{pendingHandover.amount.toLocaleString('en-IN')}
                      </div>

                      {pendingHandover.amount > 0 ? (
                        <p className="text-xs font-medium text-blue-600/90 dark:text-blue-500/90 mt-1">
                          Not handed over yet
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" /> All clear
                        </p>
                      )}
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl",
                      pendingHandover.amount > 0 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "bg-muted text-muted-foreground"
                    )}>
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>

                  {pendingHandover.amount > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium border-0 shadow-sm"
                        onClick={() => router.push(StaffRoutes.PAYMENTS)}
                      >
                        Handover Details <ArrowRight className="ml-1.5 w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Today's Collection */}
              {paymentsData && (
                <Card className="shadow-sm border-dashed">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-foreground">Cash Collected</span>
                        </div>
                        <span className="font-medium">₹{paymentsData.totals.cash.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-foreground">Online Payments</span>
                        </div>
                        <span className="font-medium">₹{paymentsData.totals.online.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-2 mt-1 border-t flex items-center justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>₹{(paymentsData.totals.cash + paymentsData.totals.online).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
