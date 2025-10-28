'use client';

import { DashboardKPI } from '@/components/admin/DashboardKPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, ShoppingBag, Users, Calendar, TrendingUp, Clock, CheckCircle, BarChart3, PieChart } from 'lucide-react';

const kpis = [
  {
    name: 'Total Revenue',
    value: '₹1,81,770',
    change: '+12.5%',
    trend: 'up' as const,
    icon: IndianRupee,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'This month'
  },
  {
    name: 'Total Orders',
    value: '436',
    change: '+8.2%',
    trend: 'up' as const,
    icon: ShoppingBag,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'This month'
  },
  {
    name: 'Active Customers',
    value: '1,234',
    change: '+5.3%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'Total users'
  },
  {
    name: 'Bookings',
    value: '247',
    change: '+18.2%',
    trend: 'up' as const,
    icon: Calendar,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'This month'
  },
];

const recentActivity = [
  { id: 1, type: 'order', message: 'New order #ORD001 placed', time: '5 min ago', status: 'new' },
  { id: 2, type: 'booking', message: 'Service booking #BK045 confirmed', time: '15 min ago', status: 'success' },
  { id: 3, type: 'customer', message: 'New customer registration', time: '1 hour ago', status: 'info' },
  { id: 4, type: 'order', message: 'Order #ORD002 completed', time: '2 hours ago', status: 'success' },
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Welcome back! Here's what's happening today
          </p>
        </div>
        <Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <TrendingUp className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View Reports
        </Button>
      </div>

      {/* KPIs */}
      <DashboardKPI kpis={kpis} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Revenue Overview</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs w-fit">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {revenueData.map((data, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={data.month} className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-foreground">{data.month}</span>
                      <span className="font-bold text-primary">₹{data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Service Distribution</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs w-fit">This month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: 'Premium Wash', count: 145, percentage: 35 },
                { name: 'Basic Wash', count: 98, percentage: 24 },
                { name: 'Interior Detailing', count: 87, percentage: 21 },
                { name: 'Full Detailing', count: 52, percentage: 13 },
                { name: 'Others', count: 28, percentage: 7 },
              ].map((service, index) => {
                const opacity = 1 - (index * 0.15);
                return (
                  <div key={service.name} className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <div 
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary flex-shrink-0" 
                          style={{ opacity }}
                        />
                        <span className="font-medium text-foreground truncate">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <span className="text-muted-foreground">{service.count}</span>
                        <span className="font-bold text-foreground">{service.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${service.percentage}%`, opacity }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5 sm:space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {activity.message}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0 capitalize">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 sm:space-y-2">
            <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm">
              <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              View Bookings
            </Button>
            <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm">
              <ShoppingBag className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Manage Orders
            </Button>
            <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm">
              <Users className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              View Customers
            </Button>
            <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm">
              <TrendingUp className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
