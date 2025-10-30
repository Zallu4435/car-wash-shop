'use client';

import { useMemo, useState } from 'react';
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
  IndianRupee,
  Users,
  ShoppingBag,
  Star
} from 'lucide-react';
import { useRevenueReport, useStaffPerformanceReport, useServiceReport } from '@/api/domains/admin-reports/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { ExportButton } from '@/components/admin/ExportButton';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('last-12-months');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Calculate date range based on selection using useMemo to avoid recalculation
  const { fromDate, toDate } = useMemo(() => {
    const today = new Date();
    const fromDate = new Date();
    
    switch (timeRange) {
      case 'last-7-days':
        fromDate.setDate(today.getDate() - 7);
        break;
      case 'last-30-days':
        fromDate.setDate(today.getDate() - 30);
        break;
      case 'last-3-months':
        fromDate.setMonth(today.getMonth() - 3);
        break;
      case 'last-6-months':
        fromDate.setMonth(today.getMonth() - 6);
        break;
      case 'last-12-months':
        fromDate.setMonth(today.getMonth() - 12);
        break;
      default:
        fromDate.setMonth(today.getMonth() - 12);
    }
    
    return {
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: today.toISOString().split('T')[0],
    };
  }, [timeRange]);
  
  const { data: revenueReport, isLoading: revenueLoading, error: revenueError, refetch: refetchRevenue } = useRevenueReport(fromDate, toDate);
  const { data: staffReport, isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useStaffPerformanceReport(fromDate, toDate);
  const { data: serviceReport, isLoading: serviceLoading, error: serviceError, refetch: refetchService } = useServiceReport(fromDate, toDate);

  const isLoading = revenueLoading || staffLoading || serviceLoading;
  const error = revenueError || staffError || serviceError;

  // Prepare export data based on selected tab
  const getExportData = () => {
    if (selectedTab === 'overview' || selectedTab === 'revenue') {
      return {
        data: revenueReport?.revenueByMonth || [],
        headers: ['month', 'revenue'],
        filename: `revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}`,
        title: 'Revenue Report',
      };
    } else if (selectedTab === 'services') {
      return {
        data: serviceReport || [],
        headers: ['serviceName', 'totalBookings', 'completedBookings', 'cancelledBookings', 'totalRevenue', 'avgRating'],
        filename: `services-report-${timeRange}-${new Date().toISOString().split('T')[0]}`,
        title: 'Services Report',
      };
    } else if (selectedTab === 'customers') {
      return {
        data: staffReport || [],
        headers: ['staffName', 'completedJobs', 'totalEarnings', 'avgRating', 'completionRate'],
        filename: `staff-report-${timeRange}-${new Date().toISOString().split('T')[0]}`,
        title: 'Staff Performance Report',
      };
    }
    return {
      data: [],
      headers: [],
      filename: 'report',
      title: 'Report',
    };
  };

  const exportConfig = getExportData();

  if (isLoading) {
    return <Loading text="Loading reports..." />;
  }

  if (error) {
    return <Error message="Failed to load reports" details={error?.message} onRetry={() => {
      refetchRevenue();
      refetchStaff();
      refetchService();
    }} />;
  }

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
          <ExportButton
            data={exportConfig.data}
            filename={exportConfig.filename}
            headers={exportConfig.headers}
            title={exportConfig.title}
            filters={{
              'Time Range': timeRange.replace(/-/g, ' '),
              'From Date': fromDate,
              'To Date': toDate,
              'Tab': selectedTab,
            }}
            variant="outline"
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
      
      {/* Tab Content Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Showing: <span className="font-semibold text-foreground capitalize">{selectedTab}</span></span>
        <span>•</span>
        <span className="font-medium">{timeRange.replace(/-/g, ' ')}</span>
        <span>•</span>
        <span className="text-xs">
          {fromDate} to {toDate}
        </span>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: IndianRupee, color: 'hsl(221 83% 53%)', label: 'Total Revenue', value: `₹${revenueReport?.totalRevenue?.toLocaleString('en-IN') || '0'}`, change: '+12.5%' },
          { icon: ShoppingBag, color: 'hsl(160 60% 45%)', label: 'Total Orders', value: String(revenueReport?.revenueByService?.reduce((sum, s) => sum + s.bookings, 0) || 0), change: '+8.3%' },
          { icon: Users, color: 'hsl(280 65% 60%)', label: 'Top Services', value: String(serviceReport?.length || 0), change: '+15.2%' },
          { icon: Star, color: 'hsl(43 74% 66%)', label: 'Avg. Rating', value: serviceReport && serviceReport.length > 0 ? ((serviceReport.reduce((sum, s) => sum + s.avgRating, 0) / serviceReport.length).toFixed(1)) : '0', change: '+0.3' },
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
            <Badge variant="outline" className="text-xs w-fit">
              {timeRange.replace(/-/g, ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {revenueReport?.revenueByMonth && revenueReport.revenueByMonth.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {revenueReport.revenueByMonth.map((data, index) => {
                const revenue = data.revenue || 0;
                const maxRev = Math.max(...revenueReport.revenueByMonth.map(d => d.revenue || 0));
                const percentage = maxRev > 0 ? (revenue / maxRev) * 100 : 0;
                return (
                  <div key={`${data.month}-${index}`} className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-foreground w-8 sm:w-12">{data.month}</span>
                      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="font-bold text-foreground w-20 sm:w-24 text-right">
                          ₹{(revenue / 1000).toFixed(0)}K
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
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No revenue data"
              description="No revenue data available for this period"
            />
          )}
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
            {serviceReport && serviceReport.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {serviceReport.slice(0, 5).map((service, index) => {
                const serviceName = service.serviceName;
                const serviceValue = service.totalBookings;
                const totalBookings = serviceReport.reduce((sum, s) => sum + (s.totalBookings || 0), 0);
                const servicePercentage = totalBookings > 0 ? Math.round((serviceValue / totalBookings) * 100) : 0;
                const colors = ['hsl(221 83% 53%)', 'hsl(160 60% 45%)', 'hsl(30 80% 55%)', 'hsl(280 65% 60%)', 'hsl(340 75% 55%)'];
                
                return (
                <div key={serviceName} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                        style={{ 
                          backgroundColor: colors[index],
                          opacity: 1 - (index * 0.1)
                        }}
                      />
                      <span className="font-medium text-foreground truncate">{serviceName}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="text-muted-foreground">{serviceValue}</span>
                      <span className="font-bold text-foreground w-10 sm:w-12 text-right">
                        {servicePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${servicePercentage}%`,
                        backgroundColor: colors[index],
                        opacity: 1 - (index * 0.1)
                      }}
                    />
                  </div>
                </div>
                );
                })}
              </div>
            ) : (
              <EmptyState
                icon={PieChart}
                title="No service data"
                description="No service distribution data available"
              />
            )}
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
            {revenueReport?.revenueByProduct && revenueReport.revenueByProduct.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {revenueReport.revenueByProduct.slice(0, 5).map((product, index) => (
                <div key={product.product} className="flex items-center gap-3 sm:gap-4">
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
                      {product.product}
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
            ) : (
              <EmptyState
                icon={Activity}
                title="No product data"
                description="No product sales data available"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 sm:p-2 rounded-lg"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <CardTitle className="text-base sm:text-lg">Staff Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {staffReport && staffReport.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {staffReport.slice(0, 4).map((staff, index) => {
              const colors = [
                'hsl(221 83% 53%)',
                'hsl(160 60% 45%)',
                'hsl(280 65% 60%)',
                'hsl(43 74% 66%)'
              ];
              return (
                <div 
                  key={staff.staffId}
                  className="p-4 sm:p-5 rounded-lg sm:rounded-xl border border-border bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate flex-1">
                      {staff.staffName}
                    </p>
                    <Badge 
                      variant="outline"
                      className="gap-0.5 sm:gap-1 text-[10px] sm:text-xs flex-shrink-0 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      ⭐ {staff.avgRating.toFixed(1)}
                    </Badge>
                  </div>
                  <p 
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: colors[index] }}
                  >
                    {staff.completedJobs}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {staff.completionRate.toFixed(1)}% completion
                  </p>
                </div>
              );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No staff data"
              description="No staff performance data available"
            />
          )}
        </CardContent>
      </Card>
      </>
      )}

      {/* Revenue Tab */}
      {selectedTab === 'revenue' && (
        <>
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Revenue Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed revenue breakdown and trends</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">₹{revenueReport?.totalRevenue?.toLocaleString('en-IN') || '0'}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-muted-foreground">By Services</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{revenueReport?.revenueByService?.reduce((sum, s) => sum + s.revenue, 0)?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-muted-foreground">By Products</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{revenueReport?.revenueByProduct?.reduce((sum, p) => sum + p.revenue, 0)?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Revenue by Service</h3>
                  <div className="space-y-3">
                    {revenueReport?.revenueByService?.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{service.service}</span>
                        <div className="text-right">
                          <p className="font-bold">₹{service.revenue.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-muted-foreground">{service.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Revenue by Payment Method</h3>
                  <div className="space-y-3">
                    {revenueReport?.revenueByPaymentMethod?.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{method.method}</span>
                        <div className="text-right">
                          <p className="font-bold">₹{method.amount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-muted-foreground">{method.count} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Services Tab */}
      {selectedTab === 'services' && (
        <>
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Service Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed service analytics and ratings</p>
            </CardHeader>
            <CardContent>
              {serviceReport && serviceReport.length > 0 ? (
                <div className="space-y-4">
                  {serviceReport.map((service, index) => (
                  <div key={service.serviceId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {service.serviceId}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        ⭐ {service.avgRating.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Bookings</p>
                        <p className="text-xl font-bold">{service.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold text-green-600">{service.completedBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cancelled</p>
                        <p className="text-xl font-bold text-red-600">{service.cancelledBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold">₹{service.totalRevenue.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Trend: {service.popularityTrend}
                      </Badge>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Activity}
                  title="No service data"
                  description="No service performance data available"
                />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Customers Tab */}
      {selectedTab === 'customers' && (
        <>
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Staff Performance Details</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed staff metrics and performance</p>
            </CardHeader>
            <CardContent>
              {staffReport && staffReport.length > 0 ? (
                <div className="space-y-4">
                  {staffReport.map((staff, index) => (
                  <div key={staff.staffId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{staff.staffName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {staff.staffId}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        ⭐ {staff.avgRating.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Jobs</p>
                        <p className="text-xl font-bold">{staff.totalJobs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold text-green-600">{staff.completedJobs}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completion Rate</p>
                        <p className="text-xl font-bold">{staff.completionRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="text-xl font-bold">₹{staff.totalEarnings.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        On-Time Rate: {staff.onTimeRate.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No staff data"
                  description="No staff performance data available"
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
