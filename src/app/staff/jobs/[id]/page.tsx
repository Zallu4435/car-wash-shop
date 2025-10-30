'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, User, Calendar, Clock, Car, DollarSign, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationMap } from '@/components/staff/NavigationMap';
import { useStaffJobDetail } from '@/api/domains/staff';
import { StaffRoutes } from '@/lib/constants/routes';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: job, isLoading, error } = useStaffJobDetail(id);

  if (isLoading) {
    return <Loading text="Loading job details..." />;
  }

  if (error) {
    return <Error message="Failed to load job details" details={error?.message} />;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2">
          <CardContent className="pt-10 sm:pt-12 pb-6 sm:pb-8 text-center px-4 sm:px-6">
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
              Job not found
            </p>
            <Button 
              onClick={() => router.push(StaffRoutes.JOBS)}
              className="h-10 sm:h-11 text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push(StaffRoutes.JOBS)}
          className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Jobs
        </Button>
        <Badge variant="default" className="text-xs sm:text-sm w-fit capitalize">
          {job.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Job Details */}
          <Card className="border-2">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Job Details</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs w-fit">
                {id}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Customer */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Customer
                  </p>
                </div>
                <p className="font-bold text-base sm:text-lg text-foreground truncate">
                  {job.customer.name}
                </p>
                {/* Phone not available in StaffJobDetail */}
              </div>

              {/* Service */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Service
                  </p>
                </div>
                <p className="font-semibold text-sm sm:text-base text-foreground">
                  {job.service}
                </p>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Date
                    </p>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm md:text-base text-foreground">
                    {job.datetime?.split('T')[0]}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                      Time
                    </p>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm md:text-base text-foreground">
                    {job.datetime?.split('T')[1]?.slice(0,5)}
                  </p>
                </div>
              </div>

              {/* Vehicle */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                    Vehicle
                  </p>
                </div>
                {/* Vehicle details may not be available in StaffJobDetail */}
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-2">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base sm:text-lg">Payment Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-center p-2.5 sm:p-3 bg-muted rounded-lg">
                <span className="text-xs sm:text-sm text-muted-foreground">Total Amount</span>
                <span className="font-bold text-base sm:text-lg text-foreground">
                  ₹{job.amount ?? 0}
                </span>
              </div>
              {/* Additional payment breakdown not available */}
            </CardContent>
          </Card>

          {/* Complete Button */}
          <Button 
            asChild 
            className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base" 
            size="lg"
          >
            <a href={`${StaffRoutes.JOBS}/${id}/complete`}>
              <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Mark as Completed
            </a>
          </Button>
        </div>

        {/* Right Column - Navigation */}
        <div className="lg:col-span-1">
          <NavigationMap
            address={job.location}
            customerPhone={''}
          />
        </div>
      </div>
    </div>
  );
}
