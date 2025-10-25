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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today</p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          View Reports
        </Button>
      </div>

      {/* KPIs */}
      <DashboardKPI kpis={kpis} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Revenue Overview</CardTitle>
              </div>
              <Badge variant="outline">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((data, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                const percentage = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{data.month}</span>
                      <span className="font-bold text-primary">₹{data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Service Distribution</CardTitle>
              </div>
              <Badge variant="outline">This month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Premium Wash', count: 145, percentage: 35 },
                { name: 'Basic Wash', count: 98, percentage: 24 },
                { name: 'Interior Detailing', count: 87, percentage: 21 },
                { name: 'Full Detailing', count: 52, percentage: 13 },
                { name: 'Others', count: 28, percentage: 7 },
              ].map((service, index) => {
                // Use different primary shades for variation
                const opacity = 1 - (index * 0.15);
                return (
                  <div key={service.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full bg-primary" 
                          style={{ opacity }}
                        />
                        <span className="font-medium text-foreground">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{service.count}</span>
                        <span className="font-bold text-foreground">{service.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-2 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted rounded-xl hover:shadow-sm transition-shadow">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              View Bookings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Manage Orders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              View Customers
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
