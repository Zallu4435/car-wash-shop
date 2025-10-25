'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Star, Briefcase, IndianRupee, TrendingUp } from 'lucide-react';

export default function StaffReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Staff Performance Reports</h1>
          <p className="text-muted-foreground mt-1">Team analytics and performance metrics</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">23</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">548</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/30 rounded-xl">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">4.6 ⭐</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">₹3.4L</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Top Performing Staff Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Rahul Kumar', jobs: 156, rating: 4.8, earnings: 125600, growth: '+15%' },
              { name: 'Vijay Patel', jobs: 203, rating: 4.7, earnings: 145230, growth: '+22%' },
              { name: 'Amit Sharma', jobs: 89, rating: 4.6, earnings: 78450, growth: '+8%' },
              { name: 'Suresh Reddy', jobs: 134, rating: 4.5, earnings: 98700, growth: '+12%' },
              { name: 'Prakash Singh', jobs: 112, rating: 4.6, earnings: 87500, growth: '+10%' },
            ].map((staff, index) => (
              <div key={staff.name} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="font-semibold text-foreground">{staff.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {staff.jobs} jobs
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                          {staff.rating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">₹{staff.earnings.toLocaleString()}</p>
                  <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {staff.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
