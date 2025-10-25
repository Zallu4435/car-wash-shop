'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, Star, IndianRupee } from 'lucide-react';

export default function ServiceReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Service Reports</h1>
          <p className="text-muted-foreground mt-1">Detailed service booking analytics</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">247</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">₹1,25,430</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-950/30 rounded-xl">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">4.7 ⭐</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +0.3 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Services */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Top Performing Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Premium Wash', bookings: 89, revenue: 44411 },
              { name: 'Interior Detailing', bookings: 67, revenue: 33433 },
              { name: 'Full Detailing', bookings: 45, revenue: 22455 },
            ].map((service, index) => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">₹{service.revenue.toLocaleString()}</p>
                  <Badge variant="outline" className="text-xs">Revenue</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
