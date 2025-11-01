'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, User, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTicket } from '@/api/domains/support/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { ROUTES } from '@/lib/constants/routes';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Fetch ticket from API
  const { data: complaint, isLoading, error, refetch } = useTicket(id);

  // Loading state
  if (isLoading) {
    return <Loading text="Loading complaint details..." />;
  }

  // Error state
  if (error || !complaint) {
    return <Error message="Failed to load complaint details" onRetry={refetch} />;
  }

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

  const statusConfig = getStatusConfig(complaint.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8">
          <Link href={ROUTES.CUSTOMER.SUPPORT_TICKETS}>
            <Button variant="ghost" className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Back to My Complaints</span>
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 truncate">
                Complaint #{id}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge variant={statusConfig.variant} className="flex-shrink-0 text-xs sm:text-sm">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Complaint Details Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Complaint Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Topic */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Topic</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-semibold capitalize">
                      {complaint.topic}
                    </Badge>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Priority</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-semibold capitalize">
                      {complaint.priority}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Subject */}
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground">{complaint.subject}</p>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Description</p>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{complaint.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Customer Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-base font-semibold text-foreground">{complaint.userId}</p>
                </div>
                {complaint.assignedTo && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                    <p className="text-base font-semibold text-foreground">{complaint.assignedTo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Update Card */}
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <StatusIcon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Status Update</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated: {new Date(complaint.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-foreground leading-relaxed">
                      Status: {statusConfig.label}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 pl-4 border-l-2 border-border ml-6">
                  <div className="relative">
                    <div className="absolute -left-[1.4rem] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Complaint Submitted</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[1.4rem] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground capitalize">{statusConfig.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.updatedAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Need Further Assistance?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions or need to provide additional information, please contact our support team.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" className="border-2 h-9 text-xs sm:text-sm" asChild>
                        <Link href={ROUTES.CUSTOMER.SUPPORT}>Contact Support</Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 text-xs sm:text-sm" asChild>
                        <Link href={ROUTES.CUSTOMER.SUPPORT_TICKETS}>View All Complaints</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
