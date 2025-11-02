'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
 
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
import { ProgressBar } from '@/components/admin/ProgressBar';
import { StatCard } from '@/components/admin/StatCard';
import { PerformanceCard } from '@/components/admin/PerformanceCard';

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
            <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10 text-xs sm:text-sm border-2">
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
            className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted border-2 border-border rounded-lg sm:rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg border-2 border-border font-medium transition-all data-[state=active]:border-primary data-[state=active]:border-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-muted hover:border-muted-foreground/30"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="revenue" 
            className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg border-2 border-border font-medium transition-all data-[state=active]:border-primary data-[state=active]:border-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-muted hover:border-muted-foreground/30"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg border-2 border-border font-medium transition-all data-[state=active]:border-primary data-[state=active]:border-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-muted hover:border-muted-foreground/30"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-lg border-2 border-border font-medium transition-all data-[state=active]:border-primary data-[state=active]:border-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl data-[state=active]:scale-105 hover:bg-muted hover:border-muted-foreground/30"
          >
            Services
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Tab Content Indicator */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
        <span>Showing: <span className="font-semibold text-foreground capitalize">{selectedTab}</span></span>
        <span className="hidden sm:inline">•</span>
        <span className="font-medium text-[10px] sm:text-sm">{timeRange.replace(/-/g, ' ')}</span>
        <span className="hidden sm:inline">•</span>
        <span className="text-[10px] sm:text-xs">
          {fromDate} to {toDate}
        </span>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={IndianRupee}
              label="Total Revenue"
              value={`₹${revenueReport?.totalRevenue?.toLocaleString('en-IN') || '0'}`}
              change="+12.5%"
              trend="up"
              description="This period"
              valueClassName="text-primary"
            />
            
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={String(revenueReport?.revenueByService?.reduce((sum, s) => sum + s.bookings, 0) || 0)}
              change="+8.3%"
              trend="up"
              description="Total bookings"
            />
            
            <StatCard
              icon={Users}
              label="Top Services"
              value={String(serviceReport?.length || 0)}
              change="+15.2%"
              trend="up"
              description="Active services"
            />
            
            <StatCard
              icon={Star}
              label="Avg. Rating"
              value={serviceReport && serviceReport.length > 0 ? ((serviceReport.reduce((sum, s) => sum + s.avgRating, 0) / serviceReport.length).toFixed(1)) : '0'}
              change="+0.3"
              trend="up"
              description="Customer satisfaction"
            />
          </div>

      {/* Revenue Trend Chart */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Revenue Trend</CardTitle>
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
                const percentage = maxRev > 0 ? Math.round((revenue / maxRev) * 100) : 0;
                return (
                  <div key={`${data.month}-${index}`}>
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                      <span className="font-medium text-foreground w-8 sm:w-12">{data.month}</span>
                      <span className="font-bold text-foreground w-20 sm:w-24 text-right">
                        ₹{(revenue / 1000).toFixed(0)}K
                      </span>
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
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Service Distribution</CardTitle>
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
                const opacity = 1 - (index * 0.1);
                
                return (
                  <ProgressBar
                    key={serviceName}
                    percentage={servicePercentage}
                    color={colors[index]}
                    opacity={opacity}
                    height="sm"
                    label={serviceName}
                    value={serviceValue}
                  />
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
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base lg:text-lg">Top Selling Products</CardTitle>
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
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">Staff Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {staffReport && staffReport.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {staffReport.slice(0, 4).map((staff) => (
                <div 
                  key={staff.staffId}
                  className="p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 border-border bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate flex-1">
                      {staff.staffName}
                    </p>
                    <Badge 
                      variant="outline"
                      className="gap-0.5 sm:gap-1 text-[10px] sm:text-xs flex-shrink-0 ml-1"
                    >
                      ⭐ {staff.avgRating.toFixed(1)}
                    </Badge>
                  </div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                    {staff.completedJobs}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {staff.completionRate.toFixed(1)}% completion
                  </p>
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

      {/* Revenue Tab */}
      {selectedTab === 'revenue' && (
        <>
          <Card className="border-2 border-border">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Revenue Analytics</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Detailed revenue breakdown and trends</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₹{revenueReport?.totalRevenue?.toLocaleString('en-IN') || '0'}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                    <p className="text-xs sm:text-sm text-muted-foreground">By Services</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      ₹{revenueReport?.revenueByService?.reduce((sum, s) => sum + s.revenue, 0)?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20">
                    <p className="text-xs sm:text-sm text-muted-foreground">By Products</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      ₹{revenueReport?.revenueByProduct?.reduce((sum, p) => sum + p.revenue, 0)?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Revenue by Service</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {revenueReport?.revenueByService?.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                        <span className="font-medium text-xs sm:text-sm truncate flex-1 mr-2">{service.service}</span>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-xs sm:text-sm">₹{service.revenue.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{service.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Revenue by Payment Method</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {revenueReport?.revenueByPaymentMethod?.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 sm:p-3 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
                        <span className="font-medium text-xs sm:text-sm truncate flex-1 mr-2">{method.method}</span>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-xs sm:text-sm">₹{method.amount.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{method.count} transactions</p>
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
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Service Performance</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Detailed service analytics and ratings</p>
            </CardHeader>
            <CardContent>
              {serviceReport && serviceReport.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {serviceReport.map((service) => (
                    <PerformanceCard
                      key={service.serviceId}
                      id={service.serviceId}
                      name={service.serviceName}
                      rating={service.avgRating}
                      metrics={[
                        { label: 'Total Bookings', value: service.totalBookings },
                        { label: 'Completed', value: service.completedBookings, highlight: true },
                        { label: 'Cancelled', value: service.cancelledBookings },
                        { label: 'Revenue', value: `₹${service.totalRevenue.toLocaleString('en-IN')}`, highlight: true },
                      ]}
                      badge={{ label: 'Trend', value: service.popularityTrend }}
                    />
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
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Staff Performance Details</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Detailed staff metrics and performance</p>
            </CardHeader>
            <CardContent>
              {staffReport && staffReport.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {staffReport.map((staff) => (
                    <PerformanceCard
                      key={staff.staffId}
                      id={staff.staffId}
                      name={staff.staffName}
                      rating={staff.avgRating}
                      metrics={[
                        { label: 'Total Jobs', value: staff.totalJobs },
                        { label: 'Completed', value: staff.completedJobs, highlight: true },
                        { label: 'Completion Rate', value: `${staff.completionRate.toFixed(1)}%` },
                        { label: 'Earnings', value: `₹${staff.totalEarnings.toLocaleString('en-IN')}` },
                      ]}
                      badge={{ label: 'On-Time Rate', value: `${staff.onTimeRate.toFixed(1)}%` }}
                    />
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
