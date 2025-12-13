'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
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
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Filter
} from 'lucide-react';
import { CountUp } from '@/components/ui/count-up';
import {
  mockStats,
  mockOrders,
  mockBookings,
  mockOrderStatusData,
  mockBookingStatusData,
  mockActivityData,
} from './mockData';
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

import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('orders');
  const [chartTab, setChartTab] = useState<'product' | 'service'>('product');
  const router = useRouter();

  const handleViewAll = () => {
    if (activeTab === 'orders') {
      router.push('/admin/orders');
    } else {
      router.push('/admin/requests');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto">
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
          value={mockStats.totalRevenue}
          prefix="₹"
          icon={DollarSign}
          change={mockStats.revenueChange}
          description="from last month"
        />
        <StatsCard
          title="Total Orders"
          value={mockStats.totalOrders}
          icon={ShoppingCart}
          change={mockStats.ordersChange}
          description="from last month"
        />
        <StatsCard
          title="Total Bookings"
          value={mockStats.totalBookings}
          icon={Calendar}
          change={mockStats.bookingsChange}
          description="from last month"
        />
        <StatsCard
          title="Active Customers"
          value={mockStats.totalCustomers}
          icon={Users}
          change={mockStats.customersChange}
          description="from last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
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
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockActivityData}
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
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Charts */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Order & Booking Status</CardTitle>
            <CardDescription>
              Current distribution of statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="h-[250px]">
                <StatusPieChart data={mockOrderStatusData} />
              </TabsContent>
              <TabsContent value="bookings" className="h-[250px]">
                <StatusPieChart data={mockBookingStatusData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <Tabs defaultValue="orders" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="sm" className="text-sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>

        <TabsContent value="orders">
          <Card>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted/50 border-b text-sm">
                <div className="col-span-1">Order ID</div>
                <div className="col-span-1">Customer</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Payment</div>
              </div>
              <div className="divide-y">
                {mockOrders.map((order) => (
                  <div key={order.id} className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-muted/50 transition-colors">
                    <div className="font-medium">{order.id}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                        {order.customer.charAt(0)}
                      </div>
                      {order.customer}
                    </div>
                    <div className="text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                    <div className="font-medium">₹{order.amount}</div>
                    <div><StatusBadge status={order.status} /></div>
                    <div className="text-right"><StatusBadge status={order.paymentStatus} type="payment" /></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted/50 border-b text-sm">
                <div className="col-span-1">Booking ID</div>
                <div className="col-span-1">Customer</div>
                <div className="col-span-1">Service</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1 text-right">Status</div>
              </div>
              <div className="divide-y">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-muted/50 transition-colors">
                    <div className="font-medium">{booking.id}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                        {booking.customer.charAt(0)}
                      </div>
                      {booking.customer}
                    </div>
                    <div>{booking.service}</div>
                    <div className="text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</div>
                    <div className="font-medium">₹{booking.amount}</div>
                    <div className="text-right"><StatusBadge status={booking.status} /></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
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
