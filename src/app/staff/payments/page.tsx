'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Banknote,
  Smartphone,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Wrench,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStaffPayments } from '@/api/domains/staff';
import type { PaymentFilter } from '@/api/domains/staff/staff-payments/fetchers';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';

type FilterTab = PaymentFilter;

export default function StaffPaymentsPage() {
  // Default to today's date
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const { data, isLoading, error, refetch } = useStaffPayments(selectedDate, activeFilter);

  // Date navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    if (direction === 'prev') {
      current.setDate(current.getDate() - 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-IN', options);
  };

  // Check if date is today
  const isToday = selectedDate === today;
  const isFuture = new Date(selectedDate) > new Date(today);

  // Filter tabs config
  const filterTabs: { value: FilterTab; label: string; icon: React.ElementType }[] = [
    { value: 'all', label: 'All', icon: Banknote },
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'online', label: 'Online/UPI', icon: Smartphone },
  ];

  // Get totals based on active filter
  const displayTotal = useMemo(() => {
    if (!data?.totals) return 0;
    if (activeFilter === 'cash') return data.totals.cash;
    if (activeFilter === 'online') return data.totals.online;
    return data.totals.total;
  }, [data?.totals, activeFilter]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          My Collections
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Track your daily payment collections
        </p>
      </div>

      {/* Date Picker */}
      <Card className="border-2 border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('prev')}
              className="h-9 w-9 sm:h-10 sm:w-10 border-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-sm sm:text-base font-semibold">
                  {formatDateDisplay(selectedDate)}
                </span>
                {isToday && (
                  <Badge variant="secondary" className="text-xs">
                    Today
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="date-picker" className="sr-only">
                  Select Date
                </Label>
                <Input
                  id="date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={today}
                  className="h-8 sm:h-9 text-xs sm:text-sm w-[140px] border-2"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('next')}
              disabled={isToday || isFuture}
              className="h-9 w-9 sm:h-10 sm:w-10 border-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 sm:gap-3">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 transition-all ${isActive
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Daily Total Card */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                {activeFilter === 'all' ? 'Total Collected' : activeFilter === 'cash' ? 'Cash Collected' : 'Online Collected'}
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                ₹{displayTotal.toLocaleString('en-IN')}
              </p>
              {data?.transactions && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              {data?.handoverStatus === 'received' ? (
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">Received</p>
                    <p className="text-[10px] text-muted-foreground">by Admin</p>
                  </div>
                </div>
              ) : data?.transactions && data.transactions.length > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">Pending</p>
                    <p className="text-[10px] text-muted-foreground">Handover</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Breakdown when showing all */}
          {activeFilter === 'all' && data?.totals && (data.totals.cash > 0 || data.totals.online > 0) && (
            <div className="mt-4 pt-4 border-t border-border/50 flex gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Cash</p>
                  <p className="text-sm sm:text-base font-semibold">
                    ₹{data.totals.cash.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Online/UPI</p>
                  <p className="text-sm sm:text-base font-semibold">
                    ₹{data.totals.online.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loading text="Loading transactions..." fullScreen={false} />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <Error
                message="Failed to load transactions"
                details={error?.message}
                onRetry={() => refetch()}
              />
            </div>
          ) : !data?.transactions || data.transactions.length === 0 ? (
            <EmptyState
              icon={Banknote}
              title="No collections found"
              description={`No payments collected on ${formatDateDisplay(selectedDate)}`}
            />
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {data.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-xl border-2 border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={transaction.method === 'cash' ? 'default' : 'secondary'}
                        className="text-[10px] sm:text-xs"
                      >
                        {transaction.method === 'cash' ? (
                          <><Banknote className="h-3 w-3 mr-1" /> Cash</>
                        ) : (
                          <><Smartphone className="h-3 w-3 mr-1" /> Online</>
                        )}
                      </Badge>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {transaction.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm sm:text-base font-semibold text-foreground truncate">
                        {transaction.customer}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {transaction.service}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-lg sm:text-xl font-bold text-primary">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    {transaction.advanceAmount > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Advance: ₹{transaction.advanceAmount.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
