'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    AlertTriangle,
    User,
    Package,
    Wrench,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Phone,
    Mail,
    Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAdminComplaintDetail, useResolveComplaint } from '@/api/domains/admin-complaints/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
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
        label: 'Pending Review',
        className: 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/20',
        icon: Clock
    },
    in_progress: {
        label: 'Under Investigation',
        className: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/20',
        icon: Clock
    },
    resolved_call: {
        label: 'Resolved via Call',
        className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20',
        icon: CheckCircle2
    },
    resolved_message: {
        label: 'Resolved via Message',
        className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20',
        icon: CheckCircle2
    },
    invalid: {
        label: 'Issue Invalid',
        className: 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950/20',
        icon: XCircle
    },
    ignored: {
        label: 'Ignored',
        className: 'border-gray-400 text-gray-500 bg-gray-50 dark:bg-gray-950/20',
        icon: XCircle
    },
};

const RESOLUTION_OPTIONS = [
    { value: 'in_progress', label: 'Mark as In Progress' },
    { value: 'resolved_call', label: 'Resolved via Phone Call' },
    { value: 'resolved_message', label: 'Resolved via Message' },
    { value: 'invalid', label: 'Mark as Invalid' },
    { value: 'ignored', label: 'Ignore (Hidden from customer)' },
];

export default function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [adminResponse, setAdminResponse] = useState('');

    const { data: complaint, isLoading, error, refetch } = useAdminComplaintDetail(id);
    const resolveComplaint = useResolveComplaint();

    if (isLoading) {
        return <Loading text="Loading complaint details..." />;
    }

    if (!complaint || error) {
        return (
            <Error
                message="Complaint not found"
                details={(error as any)?.message}
                onRetry={() => refetch()}
            />
        );
    }

    const statusConfig = STATUS_CONFIG[complaint.status];
    const StatusIcon = statusConfig.icon;
    const isService = complaint.referenceType === 'booking';
    const isResolved = ['resolved_call', 'resolved_message', 'invalid', 'ignored'].includes(complaint.status);

    const handleResolve = async () => {
        if (!selectedStatus) return;

        await resolveComplaint.mutateAsync({
            id: complaint.id,
            input: {
                status: selectedStatus as ComplaintStatus,
                adminResponse: adminResponse.trim() || undefined,
            },
        });

        setSelectedStatus('');
        setAdminResponse('');
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <Link href="/admin/complaints">
                    <Button variant="ghost" className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Complaints
                    </Button>
                </Link>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-orange-500/10">
                            <AlertTriangle className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Complaint Details</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Filed {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`text-sm px-3 py-1 ${statusConfig.className}`}>
                        <StatusIcon className="h-4 w-4 mr-1.5" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Complaint Details */}
                    <Card className="border-2 border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <CardTitle className="text-base sm:text-lg">Complaint Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-sm">
                                    {CATEGORY_LABELS[complaint.category]}
                                </Badge>
                                <Badge variant="outline" className={isService ? 'border-blue-500 text-blue-600' : 'border-purple-500 text-purple-600'}>
                                    {isService ? 'Service Booking' : 'Product Order'}
                                </Badge>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-xl">
                                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                                    {complaint.description}
                                </p>
                            </div>

                            {complaint.adminResponse && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-primary">Admin Response</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {complaint.adminResponse}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    {complaint.orderDetails && (
                        <Card className="border-2 border-border">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    {isService ? (
                                        <Wrench className="h-5 w-5 text-blue-600" />
                                    ) : (
                                        <Package className="h-5 w-5 text-purple-600" />
                                    )}
                                    <CardTitle className="text-base sm:text-lg">
                                        {isService ? 'Booking Details' : 'Order Details'}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-muted rounded-xl space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Order Number</span>
                                        <span className="font-medium text-foreground">#{complaint.orderDetails.orderNumber}</span>
                                    </div>
                                    {complaint.orderDetails.serviceName && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Service</span>
                                            <span className="font-medium text-foreground">{complaint.orderDetails.serviceName}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-medium text-primary">₹{complaint.orderDetails.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge variant="outline" className="capitalize">{complaint.orderDetails.status}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resolution Form */}
                    {!isResolved && (
                        <Card className="border-2 border-primary/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base sm:text-lg">Resolve Complaint</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Resolution Status</Label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select resolution action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RESOLUTION_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="response">Response to Customer (Optional)</Label>
                                    <Textarea
                                        id="response"
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Enter a response message that will be visible to the customer..."
                                        rows={4}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This message will be shown to the customer (except for "Ignored" status)
                                    </p>
                                </div>

                                <Button
                                    onClick={handleResolve}
                                    disabled={!selectedStatus || resolveComplaint.isPending}
                                    className="w-full h-11"
                                >
                                    {resolveComplaint.isPending ? (
                                        'Updating...'
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Update Complaint Status
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Customer Info */}
                    <Card className="border-2 border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base sm:text-lg">Customer</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{complaint.customerName}</p>
                                    <p className="text-xs text-muted-foreground">Customer</p>
                                </div>
                            </div>

                            <Separator />

                            {complaint.customerEmail && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{complaint.customerEmail}</span>
                                </div>
                            )}
                            {complaint.customerPhone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{complaint.customerPhone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="border-2 border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Complaint Filed</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(complaint.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {complaint.resolvedAt && (
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Resolved</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(complaint.resolvedAt).toLocaleString()}
                                        </p>
                                        {complaint.resolvedBy && (
                                            <p className="text-xs text-muted-foreground">
                                                by {complaint.resolvedBy.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
