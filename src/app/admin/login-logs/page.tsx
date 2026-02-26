'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAdminGroupedLoginLogs, useAdminLoginLogs } from '@/api/domains/admin-login-logs/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';

type ViewMode = 'grouped' | 'detailed';

export default function AdminLoginLogsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [method, setMethod] = useState<'all' | 'credentials' | 'google' | 'email-otp'>('all');
  const [success, setSuccess] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const filters = {
    method,
    success,
    from: from || undefined,
    to: to || undefined,
    page,
    limit,
  };

  const groupedQuery = useAdminGroupedLoginLogs(filters);
  const detailedQuery = useAdminLoginLogs(filters);

  const currentQuery = viewMode === 'grouped' ? groupedQuery : detailedQuery;

  const isLoading = currentQuery.isLoading;
  const isError = currentQuery.isError;
  const error = currentQuery.error as Error | null;

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    // For grouped we don't get totalPages, so just allow navigation while items are full
    if (viewMode === 'grouped') {
      const items = groupedQuery.data?.items ?? [];
      if (items.length === limit) {
        setPage((p) => p + 1);
      }
    } else {
      const pagination = detailedQuery.data?.pagination;
      if (pagination && page < pagination.totalPages) {
        setPage((p) => p + 1);
      }
    }
  };

  const renderStatusBadge = (successValue: boolean) => {
    return (
      <Badge
        variant={successValue ? 'outline' : 'destructive'}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 text-xs',
          successValue ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-destructive/60'
        )}
      >
        {successValue ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        ) : (
          <XCircle className="w-3 h-3" />
        )}
        {successValue ? 'Success' : 'Failed'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldAlert className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Login Logs</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Monitor all login attempts across the platform, grouped by user or viewed in detail.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-muted p-1">
          <Button
            size="sm"
            variant={viewMode === 'grouped' ? 'default' : 'ghost'}
            className={cn(
              'h-8 px-3 text-xs rounded-full',
              viewMode === 'grouped' && 'shadow-sm'
            )}
            onClick={() => handleViewChange('grouped')}
          >
            Grouped
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'detailed' ? 'default' : 'ghost'}
            className={cn(
              'h-8 px-3 text-xs rounded-full',
              viewMode === 'detailed' && 'shadow-sm'
            )}
            onClick={() => handleViewChange('detailed')}
          >
            Detailed
          </Button>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="pb-3 border-b bg-muted/40">
          <CardTitle className="text-sm sm:text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">Method</div>
              <Select
                value={method}
                onValueChange={(value) => {
                  setMethod(value as any);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All methods</SelectItem>
                  <SelectItem value="credentials">Credentials</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="email-otp">Email OTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">Status</div>
              <Select
                value={success}
                onValueChange={(value) => {
                  setSuccess(value as any);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">From</div>
              <Input
                type="date"
                className="h-9 text-xs sm:text-sm"
                value={from ? format(new Date(from), 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFrom(value ? new Date(value).toISOString() : '');
                  setPage(1);
                }}
              />
            </div>

            <div className="space-y-1">
              <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">To</div>
              <Input
                type="date"
                className="h-9 text-xs sm:text-sm"
                value={to ? format(new Date(to), 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setTo(value ? new Date(value).toISOString() : '');
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 flex flex-col h-full">
        <CardHeader className="pb-3 border-b bg-muted/40 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">
            {viewMode === 'grouped' ? 'Grouped by Identifier & Method' : 'Detailed Attempts'}
          </CardTitle>
          {isLoading && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading...
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {isError && (
            <div className="p-4 text-sm text-red-500">
              {error?.message || 'Failed to load login logs'}
            </div>
          )}

          {!isLoading && !isError && viewMode === 'grouped' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Identifier</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Total</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Success</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Failed</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Last Attempt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {groupedQuery.data?.items?.length ? (
                    groupedQuery.data.items.map((item, idx) => (
                      <tr key={`${item.identifier}-${item.method}-${idx}`} className="hover:bg-muted/40">
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.identifier || <span className="text-muted-foreground italic">Unknown</span>}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">
                          {item.method.replace('-', ' ')}
                        </td>
                        <td className="px-4 py-2">{item.totalAttempts}</td>
                        <td className="px-4 py-2 text-emerald-600">{item.successCount}</td>
                        <td className="px-4 py-2 text-red-500">{item.failureCount}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                          {item.lastAttemptAt ? format(new Date(item.lastAttemptAt), 'PPp') : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                        No login attempts found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && viewMode === 'detailed' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">When</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Identifier</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">IP</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {detailedQuery.data?.items?.length ? (
                    detailedQuery.data.items.map((item) => (
                      <tr key={item._id} className="hover:bg-muted/40">
                        <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                          {format(new Date(item.createdAt), 'PPp')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.user ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-xs sm:text-sm">{item.user.name || '—'}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {item.user.email || item.user.phone || ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Unknown</span>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {item.identifier || <span className="text-muted-foreground italic">Unknown</span>}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">
                          {item.method.replace('-', ' ')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {renderStatusBadge(item.success)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                          {item.ip || '—'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-red-500 max-w-xs truncate">
                          {item.errorMessage || item.errorCode || '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                        No login attempts found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="text-[11px] sm:text-xs text-muted-foreground">
              Page {page}
              {viewMode === 'detailed' && detailedQuery.data?.pagination && (
                <> of {detailedQuery.data.pagination.totalPages || 1}</>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={page === 1 || isLoading}
                onClick={handlePrevPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={isLoading}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

