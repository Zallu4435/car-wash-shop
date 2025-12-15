'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertTriangle,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Package,
    Wrench,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useAdminComplaints } from '@/api/domains/admin-complaints/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import type { ComplaintStatus, ComplaintCategory } from '@/types/admin';

const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
    service_quality: 'Service Quality',
    staff_behavior: 'Staff Behavior',
    damage_loss: 'Damage/Loss',
    wrong_service: 'Wrong Service',
    overcharged: 'Overcharged',
    other: 'Other',
};

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; className: string; icon: typeof Clock }> = {
    pending: {
        label: 'Pending',
        className: 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/20',
        icon: Clock
    },
    in_progress: {
        label: 'In Progress',
        className: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/20',
        icon: Clock
    },
    resolved_call: {
        label: 'Resolved (Call)',
        className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20',
        icon: CheckCircle2
    },
    resolved_message: {
        label: 'Resolved (Message)',
        className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20',
        icon: CheckCircle2
    },
    invalid: {
        label: 'Invalid',
        className: 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950/20',
        icon: XCircle
    },
    ignored: {
        label: 'Ignored',
        className: 'border-gray-400 text-gray-500 bg-gray-50 dark:bg-gray-950/20',
        icon: XCircle
    },
};

export default function AdminComplaintsPage() {
    const [search, setSearch] = useState('');
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filters = useMemo(() => ({
        search: search || undefined,
        status: filterValues.status as ComplaintStatus || undefined,
        category: filterValues.category as ComplaintCategory || undefined,
        referenceType: filterValues.type as 'booking' | 'productOrder' || undefined,
        page,
        limit: pageSize,
    }), [search, filterValues, page, pageSize]);

    const { data, isLoading, error, refetch } = useAdminComplaints(filters);

    const complaints = data?.data || [];
    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 0;

    // Calculate stats
    const stats = useMemo(() => {
        const pending = complaints.filter(c => c.status === 'pending').length;
        const inProgress = complaints.filter(c => c.status === 'in_progress').length;
        const resolved = complaints.filter(c => ['resolved_call', 'resolved_message'].includes(c.status)).length;
        return { total: complaints.length, pending, inProgress, resolved };
    }, [complaints]);

    if (isLoading) {
        return <Loading text="Loading complaints..." />;
    }

    if (error) {
        return (
            <Error
                message="Failed to load complaints"
                details={(error as any)?.message}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    Customer Complaints
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                    Manage and resolve customer complaints
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={AlertTriangle}
                    label="Total Complaints"
                    value={totalItems}
                    description="All complaints"
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={stats.pending}
                    valueClassName="text-orange-500"
                    description="Awaiting review"
                />
                <StatCard
                    icon={MessageSquare}
                    label="In Progress"
                    value={stats.inProgress}
                    valueClassName="text-blue-500"
                    description="Being investigated"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Resolved"
                    value={stats.resolved}
                    valueClassName="text-green-500"
                    description="Successfully resolved"
                />
            </div>

            {/* Complaints List */}
            <Card className="border-2 border-border rounded-lg sm:rounded-xl">
                <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                        <CardTitle className="text-sm sm:text-base lg:text-lg">All Complaints</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search & Filter */}
                    <SearchFilter
                        searchPlaceholder="Search by customer name or description..."
                        onSearchChange={setSearch}
                        filterOptions={[
                            {
                                label: 'Status',
                                value: 'status',
                                options: [
                                    { label: 'All Statuses', value: '' },
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'In Progress', value: 'in_progress' },
                                    { label: 'Resolved (Call)', value: 'resolved_call' },
                                    { label: 'Resolved (Message)', value: 'resolved_message' },
                                    { label: 'Invalid', value: 'invalid' },
                                    { label: 'Ignored', value: 'ignored' },
                                ],
                            },
                            {
                                label: 'Category',
                                value: 'category',
                                options: [
                                    { label: 'All Categories', value: '' },
                                    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
                                ],
                            },
                            {
                                label: 'Type',
                                value: 'type',
                                options: [
                                    { label: 'All Types', value: '' },
                                    { label: 'Service Bookings', value: 'booking' },
                                    { label: 'Product Orders', value: 'productOrder' },
                                ],
                            },
                        ]}
                        onFilterChange={setFilterValues}
                        className="mb-4 sm:mb-6"
                    />

                    {/* Complaints Grid */}
                    {complaints.length === 0 ? (
                        <EmptyState
                            icon={AlertTriangle}
                            title="No complaints found"
                            description={search ? "Try adjusting your search or filters" : "No complaints have been filed yet"}
                        />
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {complaints.map((complaint) => {
                                const statusConfig = STATUS_CONFIG[complaint.status];
                                const StatusIcon = statusConfig.icon;
                                const isService = complaint.referenceType === 'booking';

                                return (
                                    <Link
                                        key={complaint.id}
                                        href={`/admin/complaints/${complaint.id}`}
                                        className="block"
                                    >
                                        <Card className="border hover:border-primary/50 transition-colors cursor-pointer">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div className={`p-2.5 rounded-lg ${isService ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                                                        {isService ? (
                                                            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-sm sm:text-base text-foreground">
                                                                    {complaint.customerName}
                                                                </h3>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {isService ? 'Service Booking' : 'Product Order'} • {new Date(complaint.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <Badge variant="outline" className={`text-xs shrink-0 ${statusConfig.className}`}>
                                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {CATEGORY_LABELS[complaint.category]}
                                                            </Badge>
                                                            {complaint.orderDetails && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    #{complaint.orderDetails.orderNumber}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                            {complaint.description}
                                                        </p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {complaints.length > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setPage(1);
                            }}
                            className="mt-4 sm:mt-6"
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
