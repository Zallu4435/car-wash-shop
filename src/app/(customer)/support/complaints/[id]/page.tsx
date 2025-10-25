'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, User, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data - replace with actual API call
  const complaint = {
    id,
    orderId: 'ORD001',
    issueType: 'Service Quality',
    subject: 'Incomplete Service',
    description: 'The service was not completed as expected. Several areas were left unwashed and the interior cleaning was rushed. I would like a refund or a complimentary service to make up for this.',
    status: 'under_review',
    submittedAt: '2025-10-20T14:30:00Z',
    updatedAt: '2025-10-21T10:15:00Z',
    customerName: 'John Doe',
    response: 'We are reviewing your complaint. Our team will contact you within 24 hours to resolve this issue.',
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'under_review':
        return { label: 'Under Review', variant: 'secondary' as const, icon: Clock };
      case 'resolved':
        return { label: 'Resolved', variant: 'success' as const, icon: CheckCircle2 };
      case 'pending':
        return { label: 'Pending', variant: 'warning' as const, icon: AlertCircle };
      default:
        return { label: 'Open', variant: 'default' as const, icon: AlertCircle };
    }
  };

  const statusConfig = getStatusConfig(complaint.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8">
          <Link href="/support/complaints">
            <Button variant="ghost" className="mb-4 hover:bg-muted">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Complaint #{id}
              </h1>
              <p className="text-muted-foreground">
                Submitted on {new Date(complaint.submittedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge variant={statusConfig.variant} className="shrink-0">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Complaint Details Card */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Complaint Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order ID */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                    <p className="text-base font-semibold text-foreground">{complaint.orderId}</p>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Issue Type</p>
                    <Badge variant="outline" className="font-semibold">
                      {complaint.issueType}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Subject */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-lg font-semibold text-foreground">{complaint.subject}</p>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-foreground leading-relaxed">{complaint.description}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base font-semibold text-foreground">{complaint.customerName}</p>
                </div>
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
                    <p className="text-foreground leading-relaxed">{complaint.response}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 pl-4 border-l-2 border-border ml-6">
                  <div className="relative">
                    <div className="absolute -left-[1.4rem] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Complaint Submitted</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.submittedAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[1.4rem] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Under Review</p>
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/support">Contact Support</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/support/complaints">View All Complaints</Link>
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
