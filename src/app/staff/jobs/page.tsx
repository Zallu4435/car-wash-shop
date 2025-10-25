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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Jobs</h1>
        <p className="text-muted-foreground mt-1">Manage your assigned service jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{todayJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{upcomingJobs.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{myJobs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today" className="gap-2">
            <Clock className="h-4 w-4" />
            Today ({todayJobs.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingJobs.length})
          </TabsTrigger>
        </TabsList>

        {/* Today Jobs */}
        <TabsContent value="today">
          {todayJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  No jobs scheduled today
                </p>
                <p className="text-sm text-muted-foreground">
                  Enjoy your free time!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Jobs */}
        <TabsContent value="upcoming">
          {upcomingJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  No upcoming jobs
                </p>
                <p className="text-sm text-muted-foreground">
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
