'use client';

import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Sector
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Filter,
  Loader2
} from 'lucide-react';
import { CountUp } from '@/components/ui/count-up';
import { useAdminDashboardSummary } from '@/api/domains/admin-dashboard/queries';
import { cn } from '@/lib/utils/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState('month');
  const [chartTab, setChartTab] = useState<'product' | 'service'>('product');

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useAdminDashboardSummary(dateRange);



  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Extract data with defaults
  const stats = dashboardData?.stats || {
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalBookings: 0,
    bookingsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
  };


  const orderStatusData = dashboardData?.orderStatusData || [];
  const bookingStatusData = dashboardData?.bookingStatusData || [];
  const activityData = dashboardData?.activityData || [];

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your business metrics and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          prefix="₹"
          icon={DollarSign}
          change={stats.revenueChange}
          description="from last month"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change={stats.ordersChange}
          description="from last month"
        />
        <StatsCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          change={stats.bookingsChange}
          description="from last month"
        />
        <StatsCard
          title="Active Customers"
          value={stats.totalCustomers}
          icon={Users}
          change={stats.customersChange}
          description="from last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 flex-1 min-h-[500px]">
        <Card className="col-span-4 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Orders & Bookings</CardTitle>
              <CardDescription>
                Number of orders over time
              </CardDescription>
            </div>
            <Tabs defaultValue="product" className="w-[200px]" onValueChange={(v) => setChartTab(v as 'product' | 'service')}>
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="product" className="text-xs">Products</TabsTrigger>
                <TabsTrigger value="service" className="text-xs">Services</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pl-2 flex-1 min-h-0">
            <div className="h-full w-full">
              {activityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', color: 'hsl(var(--popover-foreground))' }}
                      itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    />
                    {chartTab === 'product' && (
                      <Area
                        type="monotone"
                        dataKey="product"
                        name="Product Orders"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorProduct)"
                      />
                    )}
                    {chartTab === 'service' && (
                      <Area
                        type="monotone"
                        dataKey="service"
                        name="Service Bookings"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorService)"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No activity data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Charts */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Order & Booking Status</CardTitle>
            <CardDescription>
              Current distribution of statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <Tabs defaultValue="orders" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="flex-1 min-h-0">
                {orderStatusData.length > 0 ? (
                  <StatusPieChart data={orderStatusData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No order data available
                  </div>
                )}
              </TabsContent>
              <TabsContent value="bookings" className="flex-1 min-h-0">
                {bookingStatusData.length > 0 ? (
                  <StatusPieChart data={bookingStatusData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No booking data available
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-components

function StatsCard({
  title,
  value,
  prefix = '',
  icon: Icon,
  change,
  description,
}: {
  title: string;
  value: number;
  prefix?: string;
  icon: any;
  change: number;
  description: string;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4 sm:pb-1 sm:pt-4 sm:px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 sm:px-4 sm:pb-4 sm:pt-0">
        <div className="text-2xl font-bold">
          <CountUp end={value} prefix={prefix} duration={2000} separator="," />
        </div>
        <div className="flex items-center text-xs mt-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={cn(isPositive ? "text-green-500" : "text-red-500", "font-medium")}>
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

import { Badge } from '@/components/ui/badge';

function StatusBadge({ status, type = 'status' }: { status: string; type?: 'status' | 'payment' }) {
  const getVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'delivered':
      case 'completed':
      case 'success':
      case 'confirmed':
      case 'paid':
        return 'default'; // Usually green or primary
      case 'processing':
      case 'pending':
      case 'shipped':
        return 'secondary'; // Usually gray/blue or secondary
      case 'cancelled':
      case 'failed':
        return 'destructive'; // Usually red
      default:
        return 'outline';
    }
  };

  const getCustomColors = (s: string) => {
    switch (s.toLowerCase()) {
      case 'delivered':
      case 'completed':
      case 'success':
      case 'confirmed':
      case 'paid':
        return 'bg-green-500 hover:bg-green-600 text-white border-transparent';
      case 'processing':
      case 'pending':
      case 'shipped':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-transparent';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500 hover:bg-red-600 text-white border-transparent';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white border-transparent';
    }
  };

  // We use custom classNames to enforce specific colors since standard variants might not match the specific green/blue/red coding we want for statuses
  // but we keep the Badge shape and typography.
  return (
    <Badge className={cn("capitalize font-normal", getCustomColors(status))}>
      {status}
    </Badge>
  );
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={14} fontWeight="bold">{`${payload.name}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

function StatusPieChart({ data }: { data: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* @ts-ignore */}
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="hsl(var(--card))"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-2xl font-bold text-foreground">
          <CountUp end={data.reduce((acc: any, curr: any) => acc + curr.value, 0)} separator="," />
        </span>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
    </div>
  );
}
