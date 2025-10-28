'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  ShoppingBag,
  Star
} from 'lucide-react';

// Mock data (keeping the same)
const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 120, customers: 89 },
  { month: 'Feb', revenue: 52000, orders: 145, customers: 102 },
  { month: 'Mar', revenue: 48000, orders: 132, customers: 95 },
  { month: 'Apr', revenue: 61000, orders: 168, customers: 118 },
  { month: 'May', revenue: 55000, orders: 152, customers: 108 },
  { month: 'Jun', revenue: 67000, orders: 189, customers: 135 },
  { month: 'Jul', revenue: 72000, orders: 201, customers: 142 },
  { month: 'Aug', revenue: 69000, orders: 195, customers: 138 },
  { month: 'Sep', revenue: 78000, orders: 215, customers: 156 },
  { month: 'Oct', revenue: 85000, orders: 234, customers: 167 },
];

const serviceDistribution = [
  { name: 'Premium Wash', value: 145, percentage: 35, color: 'hsl(221 83% 53%)' },
  { name: 'Basic Wash', value: 98, percentage: 24, color: 'hsl(160 60% 45%)' },
  { name: 'Interior Detailing', value: 87, percentage: 21, color: 'hsl(30 80% 55%)' },
  { name: 'Full Detailing', value: 52, percentage: 13, color: 'hsl(280 65% 60%)' },
  { name: 'Others', value: 28, percentage: 7, color: 'hsl(340 75% 55%)' },
];

const topProducts = [
  { name: 'Premium Car Shampoo', sales: 234, revenue: 69960 },
  { name: 'Microfiber Cloth Set', sales: 189, revenue: 37611 },
  { name: 'Car Wax Polish', sales: 156, revenue: 85644 },
  { name: 'Tire Shine Spray', sales: 142, revenue: 35358 },
  { name: 'Dashboard Cleaner', sales: 128, revenue: 38400 },
];

const customerMetrics = [
  { category: 'New Customers', count: 342, change: '+12.5%', trend: 'up' },
  { category: 'Returning Customers', count: 567, change: '+8.3%', trend: 'up' },
  { category: 'Avg. Order Value', count: 1250, change: '+5.2%', trend: 'up' },
  { category: 'Customer Satisfaction', count: 4.8, change: '+0.3', trend: 'up' },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('last-12-months');
  const [selectedTab, setSelectedTab] = useState('overview');

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Comprehensive business insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="flex-shrink-0 h-9 sm:h-10 text-xs sm:text-sm">
            <Download className="mr-0 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Customers
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Services
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: DollarSign, color: 'hsl(221 83% 53%)', label: 'Total Revenue', value: '₹6,72,000', change: '+12.5%' },
          { icon: ShoppingBag, color: 'hsl(160 60% 45%)', label: 'Total Orders', value: '1,951', change: '+8.3%' },
          { icon: Users, color: 'hsl(280 65% 60%)', label: 'Active Customers', value: '1,310', change: '+15.2%' },
          { icon: Star, color: 'hsl(43 74% 66%)', label: 'Avg. Rating', value: '4.8', change: '+0.3' },
        ].map((kpi, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div 
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl"
                  style={{ backgroundColor: `${kpi.color} / 0.1` }}
                >
                  <kpi.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: kpi.color }} />
                </div>
                <Badge variant="outline" className="gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {kpi.change}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{kpi.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-0.5 sm:mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 sm:p-2 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs w-fit">Last 10 Months</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {revenueData.map((data, index) => {
              const percentage = (data.revenue / maxRevenue) * 100;
              return (
                <div key={data.month} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-foreground w-8 sm:w-12">{data.month}</span>
                    <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="w-16 sm:w-20 text-right">{data.orders} orders</span>
                      <span className="font-bold text-foreground w-20 sm:w-24 text-right">
                        ₹{(data.revenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Distribution & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Service Distribution */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 sm:p-2 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <CardTitle className="text-base sm:text-lg">Service Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {serviceDistribution.map((service, index) => (
                <div key={service.name} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                        style={{ 
                          backgroundColor: service.color,
                          opacity: 1 - (index * 0.1)
                        }}
                      />
                      <span className="font-medium text-foreground truncate">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-muted-foreground">{service.value}</span>
                      <span className="font-bold text-foreground w-10 sm:w-12 text-right">
                        {service.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${service.percentage}%`,
                        backgroundColor: service.color,
                        opacity: 1 - (index * 0.1)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 sm:p-2 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <CardTitle className="text-base sm:text-lg">Top Selling Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3 sm:gap-4">
                  <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0"
                    style={{ 
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))'
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-xs sm:text-sm text-foreground">
                      ₹{(product.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Metrics */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 sm:p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">Customer Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {customerMetrics.map((metric, index) => {
              const colors = [
                'hsl(221 83% 53%)',
                'hsl(160 60% 45%)',
                'hsl(280 65% 60%)',
                'hsl(43 74% 66%)'
              ];
              return (
                <div 
                  key={metric.category}
                  className="p-4 sm:p-5 rounded-lg sm:rounded-xl border border-border bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate flex-1">
                      {metric.category}
                    </p>
                    <Badge 
                      variant="outline"
                      className="gap-0.5 sm:gap-1 text-[10px] sm:text-xs flex-shrink-0"
                      style={{ 
                        color: colors[index],
                        borderColor: `${colors[index]} / 0.3`
                      }}
                    >
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                  <p 
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: colors[index] }}
                  >
                    {metric.category === 'Customer Satisfaction' ? metric.count.toFixed(1) : metric.count}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
