'use client';

import { DashboardStats } from '@/components/staff/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Clock,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';

import { useStaffDashboard, useUpcomingJobs } from '@/api/domains/staff/queries';

export default function StaffDashboardPage() {
  const { data: summary } = useStaffDashboard();
  const { data: upcomingJobs } = useUpcomingJobs();
  const stats = [
    { 
      name: "Today's Jobs", 
      value: String(summary?.todayJobs ?? 0), 
      icon: Briefcase, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10',
      trend: summary?.statsTrends.todayJobs ?? ''
    },
    { 
      name: 'This Week', 
      value: String(summary?.weekJobs ?? 0), 
      icon: TrendingUp, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10',
      trend: summary?.statsTrends.weekJobs ?? ''
    },
    { 
      name: 'Earnings', 
      value: summary?.earnings ? `₹${summary.earnings}` : '₹0', 
      icon: DollarSign, 
      color: 'text-primary', 
      bgColor: 'bg-primary/10',
      trend: summary?.statsTrends.earnings ?? ''
    },
    { 
      name: 'Rating', 
      value: summary?.rating ? String(summary.rating) : '—', 
      icon: Star, 
      color: 'text-amber-600 dark:text-amber-400', 
      bgColor: 'bg-amber-100 dark:bg-amber-950/30',
      trend: summary?.statsTrends.rating ?? ''
    },
  ];
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Welcome back!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Here's what's happening with your work today
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Upcoming Jobs */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Today's Schedule</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
              View All
              <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {(upcomingJobs ?? []).map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-border">
                <CardContent className="p-3 sm:p-4">
                  {/* Desktop/Tablet Layout */}
                  <div className="hidden sm:flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {job.service}
                        </h3>
                        <Badge 
                          variant={job.status === 'confirmed' ? 'default' : 'secondary'} 
                          className="flex-shrink-0 text-xs"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Customer: {job.customer}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="flex-shrink-0 h-9 text-xs sm:text-sm">
                      View Details
                    </Button>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-2.5 sm:space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-foreground flex-1 min-w-0 line-clamp-2">
                        {job.service}
                      </h3>
                      <Badge 
                        variant={job.status === 'confirmed' ? 'default' : 'secondary'} 
                        className="flex-shrink-0 text-xs"
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{job.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Customer: {job.customer}
                      </p>
                    </div>
                    <Button size="sm" className="w-full h-9 text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
