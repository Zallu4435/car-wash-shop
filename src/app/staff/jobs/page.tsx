'use client';

import { useState } from 'react';
import { JobCard } from '@/components/staff/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { getMockData } from '@/lib/api/mockData';
import { Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function JobsPage() {
  const bookings = getMockData.bookings();
  const myJobs = bookings.filter(b => b.assignedStaffId === 'staff_001');
  
  const todayJobs = myJobs.filter(job => {
    const today = new Date().toISOString().split('T')[0];
    return job.date === today;
  });

  const upcomingJobs = myJobs.filter(job => {
    const today = new Date().toISOString().split('T')[0];
    return job.date > today;
  });

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
            <p className="text-xl sm:text-2xl font-bold text-foreground">{myJobs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
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

        {/* Today Jobs */}
        <TabsContent value="today">
          {todayJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {todayJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={{
                    id: job.id,
                    customer: job.customer.name,
                    phone: job.customer.phone,
                    service: job.service,
                    time: job.time,
                    address: job.address,
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
                    customer: job.customer.name,
                    phone: job.customer.phone,
                    service: job.service,
                    time: job.time,
                    address: job.address,
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
