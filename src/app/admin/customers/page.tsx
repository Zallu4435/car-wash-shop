'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Eye, 
  Mail,
  Phone,
  IndianRupee,
  ShoppingBag,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminCustomerList } from '@/api/domains/admin-customers/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { AdminRoutes } from '@/lib/constants/routes';

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: (filterValues.status as 'active' | 'inactive' | 'blocked' | undefined) || undefined,
    page,
    limit: pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: customerData, isLoading, error, refetch } = useAdminCustomerList(filters);

  const customers = customerData?.data || [];
  const totalItems = customerData?.total || 0;
  const totalPages = customerData?.totalPages || 0;
  const filteredCustomers = customers; // Already filtered by API

  if (isLoading) {
    return <Loading text="Loading customers..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load customers" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Customers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Manage your customer base and their activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={totalItems}
          change="+9.2%"
          trend="up"
          description="All customers"
        />
        
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0).toLocaleString()}`}
          valueClassName="text-primary"
          change="+16.5%"
          trend="up"
          description="Customer lifetime value"
        />
        
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={customers.reduce((sum: number, c: any) => sum + (c.totalOrders || 0), 0)}
          change="+11.8%"
          trend="up"
          description="All time orders"
          className="xs:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Customer List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Customers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search by name, email or phone..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                  { label: 'Blocked', value: 'blocked' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Customer Grid */}
          {filteredCustomers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              description={search ? "Try adjusting your search or filters" : "No customers yet"}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredCustomers.map((customer) => (
                <TransactionCard
                  key={customer.id}
                  id={customer.id}
                  icon={Users}
                  layout="vertical"
                  primaryBadge={{
                    label: `Joined ${customer.joinedDate}`,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: 'Customer',
                    className: '',
                  }}
                  title={customer.name}
                  subtitle={`Joined ${customer.joinedDate}`}
                  description={`${customer.email} | ${customer.phone}`}
                  infoBoxes={[
                    {
                      icon: ShoppingBag,
                      label: 'Orders',
                      value: customer.totalOrders,
                    },
                    {
                      icon: IndianRupee,
                      label: 'Spent',
                      value: `₹${customer.totalSpent.toLocaleString()}`,
                      valueClassName: 'text-primary',
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'View',
                      icon: Eye,
                      onClick: () => router.push(AdminRoutes.CUSTOMER_DETAIL(customer.id)),
                      hideTextOnMobile: true,
                    },
                  ]}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredCustomers.length > 0 && (
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
