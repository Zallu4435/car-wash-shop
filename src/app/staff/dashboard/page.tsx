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

const stats = [
  { 
    name: "Today's Jobs", 
    value: '3', 
    icon: Briefcase, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    trend: '+2 from yesterday'
  },
  { 
    name: 'This Week', 
    value: '12', 
    icon: TrendingUp, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    trend: '+4 from last week'
  },
  { 
    name: 'Earnings', 
    value: '₹5,600', 
    icon: DollarSign, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    trend: 'This week'
  },
  { 
    name: 'Rating', 
    value: '4.8', 
    icon: Star, 
    color: 'text-amber-600 dark:text-amber-400', 
    bgColor: 'bg-amber-100 dark:bg-amber-950/30',
    trend: 'Based on 24 reviews'
  },
];

const upcomingJobs = [
  {
    id: 'job_001',
    service: 'Premium Car Wash',
    customer: 'John Doe',
    time: '10:00 AM',
    location: 'Bandra West, Mumbai',
    status: 'confirmed',
  },
  {
    id: 'job_002',
    service: 'Interior Detailing',
    customer: 'Jane Smith',
    time: '2:00 PM',
    location: 'Andheri East, Mumbai',
    status: 'pending',
  },
];

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your work today</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Upcoming Jobs */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Today's Schedule</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-border">
                <CardContent className="p-4">
                  {/* Desktop/Tablet Layout */}
                  <div className="hidden sm:flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate">{job.service}</h3>
                        <Badge variant={job.status === 'confirmed' ? 'default' : 'secondary'} className="flex-shrink-0">
                          {job.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Customer: {job.customer}</p>
                      </div>
                    </div>
                    <Button size="sm" className="flex-shrink-0">
                      View Details
                    </Button>
                  </div>

                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground flex-1 min-w-0">{job.service}</h3>
                      <Badge variant={job.status === 'confirmed' ? 'default' : 'secondary'} className="flex-shrink-0">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {job.customer}</p>
                    </div>
                    <Button size="sm" className="w-full">
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
