'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Search, 
  Eye,
  IndianRupee,
  Package,
  CheckCircle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminOrderList } from '@/api/domains/admin-orders/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { StatCard } from '@/components/admin/StatCard';
import { TransactionCard } from '@/components/admin/TransactionCard';

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    dateRange: filterValues.dateRange || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: orderData, isLoading, error, refetch } = useAdminOrderList(filters);

  const orders = orderData?.data || [];
  const totalItems = orderData?.total || 0;
  const totalPages = orderData?.totalPages || 0;
  const filteredOrders = orders; // Already filtered by API

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  if (isLoading) {
    return <Loading text="Loading orders..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load orders" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const statusColors = {
    processing: { variant: 'secondary' as const, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-950/30' },
    confirmed: { variant: 'default' as const, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' },
    shipped: { variant: 'default' as const, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-950/30' },
    delivered: { variant: 'default' as const, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/30' },
    cancelled: { variant: 'secondary' as const, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-950/30' },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Product Orders
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage product orders and delivery status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={orders.length}
          change="+8.3%"
          trend="up"
          description="This month"
        />
        
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          valueClassName="text-primary"
          change="+12.5%"
          trend="up"
          description="This month"
        />
        
        <StatCard
          icon={CheckCircle}
          label="Delivered"
          value={deliveredOrders}
          change="+15.2%"
          trend="up"
          description="Successfully delivered"
        />
      </div>

      {/* Orders List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search by order ID or customer name..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Processing', value: 'processing' },
                  { label: 'Confirmed', value: 'confirmed' },
                  { label: 'Shipped', value: 'shipped' },
                  { label: 'Delivered', value: 'delivered' },
                  { label: 'Cancelled', value: 'cancelled' },
                ],
              },
              {
                label: 'Date Range',
                value: 'dateRange',
                type: 'dateRange',
                options: [
                  { label: 'All Time', value: '' },
                  { label: 'Today', value: 'today' },
                  { label: 'Last 7 Days', value: 'last-7-days' },
                  { label: 'Last 30 Days', value: 'last-30-days' },
                  { label: 'Last 3 Months', value: 'last-3-months' },
                  { label: 'Last 6 Months', value: 'last-6-months' },
                  { label: 'Last Year', value: 'last-year' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders found"
              description={search ? "Try adjusting your search or filters" : "No orders placed yet"}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredOrders.map((order) => {
              const statusStyle = statusColors[order.status as keyof typeof statusColors] || statusColors.processing;
              return (
                <TransactionCard
                  key={order.id}
                  id={order.id}
                  icon={Package}
                  primaryBadge={{
                    label: order.orderNumber,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: order.status,
                    className: `border-2 ${statusStyle.color}`,
                  }}
                  title={order.customer}
                  subtitle={order.createdAt}
                  amount={order.total}
                  amountLabel="Amount"
                  onView={() => router.push(`/admin/orders/${order.id}`)}
                  viewButtonText="View"
                />
              );
            })}
            </div>
          )}
          
          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1); // Reset to first page when changing page size
              }}
              className="mt-4 sm:mt-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
