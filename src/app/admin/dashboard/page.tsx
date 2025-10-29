'use client';

import { DashboardKPI } from '@/components/admin/DashboardKPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, ShoppingBag, Users, Calendar, TrendingUp, Clock, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import { useAdminDashboard } from '@/api/domains/admin-dashboard/queries';
import { useRouter } from 'next/navigation';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: dashboardData, isLoading, error, refetch } = useAdminDashboard();

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load dashboard" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const kpis = [
    {
      name: 'Total Revenue',
      value: `₹${dashboardData?.totalRevenue.toLocaleString() || '0'}`,
      change: dashboardData?.revenueGrowth || '+0%',
      trend: 'up' as const,
      icon: IndianRupee,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'This month'
    },
    {
      name: 'Total Orders',
      value: dashboardData?.totalOrders.toString() || '0',
      change: dashboardData?.ordersGrowth || '+0%',
      trend: 'up' as const,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'This month'
    },
    {
      name: 'Active Customers',
      value: dashboardData?.totalCustomers.toString() || '0',
      change: dashboardData?.customersGrowth || '+0%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Total users'
    },
    {
      name: 'Staff Members',
      value: dashboardData?.totalStaff.toString() || '0',
      change: dashboardData?.staffGrowth || '+0%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Active staff'
    },
  ];
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
        {/* Recent Orders */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs w-fit">Latest</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {dashboardData?.recentOrders.map((order) => (
                <div key={order.id} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-foreground">{order.customer}</span>
                    <span className="font-bold text-primary">₹{order.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                    <span>{order.date}</span>
                    <Badge variant="outline" className="text-[10px]">{order.status}</Badge>
                  </div>
                </div>
              ))}
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
              {dashboardData?.topServices.map((service, index) => {
                const maxBookings = Math.max(...(dashboardData?.topServices.map(s => s.bookings) || [1]));
                const percentage = (service.bookings / maxBookings) * 100;
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
                        <span className="text-muted-foreground">{service.bookings}</span>
                        <span className="font-bold text-foreground">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, opacity }}
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
              {dashboardData?.recentOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      Order from {order.customer}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {order.date}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0 capitalize">
                    {order.status}
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
