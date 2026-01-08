'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    RefreshCw,
    CheckCircle,
    Clock,
    DollarSign,
    AlertCircle,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAdminRefunds, useAdminRefundStats, useMarkRefunded } from '@/api/domains/refunds/queries';
import { AdminRoutes } from '@/lib/constants/routes';
import Loading from '@/components/shared/display/Loading';

export default function AdminRefundsPage() {
    const [statusFilter, setStatusFilter] = useState<'pending' | 'processed' | 'all'>('pending');
    const [page, setPage] = useState(1);

    const { data: refundsData, isLoading, refetch } = useAdminRefunds({
        status: statusFilter,
        page,
        limit: 10,
    });

    const { data: stats } = useAdminRefundStats();
    const markRefundedMutation = useMarkRefunded();

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleMarkRefunded = (bookingId: string) => {
        markRefundedMutation.mutate(bookingId);
    };

    if (isLoading) {
        return <Loading text="Loading refunds..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Refunds</h1>
                    <p className="text-muted-foreground">
                        Manage refund requests for cancelled bookings and orders
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pending?.count || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(stats?.pending?.amount || 0)} total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processed Refunds</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.processed?.count || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(stats?.processed?.amount || 0)} total
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(stats?.pending?.amount || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Needs processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(stats?.processed?.amount || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <Select
                    value={statusFilter}
                    onValueChange={(value: 'pending' | 'processed' | 'all') => {
                        setStatusFilter(value);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Refunds Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="rounded-lg border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Cancelled At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Refund Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                                {refundsData?.data && refundsData.data.length > 0 ? (
                                    refundsData.data.map((refund) => (
                                        <tr key={refund.id} className="hover:bg-muted/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {(refund as any).type === 'order' ? (
                                                    <span className="font-mono text-primary">
                                                        {(refund as any).orderId || refund.bookingId.slice(-6).toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={AdminRoutes.REQUEST_DETAIL(refund.bookingId)}
                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        #{refund.bookingId.slice(-6).toUpperCase()}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Badge variant={(refund as any).type === 'order' ? 'secondary' : 'outline'}>
                                                    {(refund as any).type === 'order' ? 'Order' : 'Booking'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div>
                                                    <p className="font-medium">{refund.customer.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {refund.customer.email || refund.customer.phone}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {refund.service}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {refund.cancelledAt ? formatDate(refund.cancelledAt) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="font-semibold text-primary">
                                                    {formatCurrency(refund.refund.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {refund.refund.status === 'pending' ? (
                                                    <Badge variant="outline" className="border-orange-500 text-orange-600">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Pending
                                                    </Badge>
                                                ) : refund.refund.status === 'processed' ? (
                                                    <Badge variant="outline" className="border-green-500 text-green-600">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Processed
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        None
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {refund.refund.status === 'pending' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleMarkRefunded(refund.bookingId)}
                                                        disabled={markRefundedMutation.isPending}
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Mark Refunded
                                                    </Button>
                                                )}
                                                {refund.refund.status === 'processed' && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {refund.refund.processedAt
                                                            ? formatDate(refund.refund.processedAt)
                                                            : 'Processed'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                                            No refunds found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {refundsData && refundsData.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {refundsData.page} of {refundsData.totalPages} ({refundsData.total} total)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= refundsData.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
