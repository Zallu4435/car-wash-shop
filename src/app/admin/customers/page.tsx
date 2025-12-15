'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Eye,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminCustomerList, useUpdateCustomerStatus } from '@/api/domains/admin-customers/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { useConfirmation } from '@/hooks/useConfirmation';
import { AdminRoutes } from '@/lib/constants/routes';

export default function CustomersPage() {
  const router = useRouter();
  const blockConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filters = useMemo(() => ({
    search: search || undefined,
    status: (filterValues.status as 'active' | 'suspended' | undefined) || undefined,
    page,
    limit: pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: customerData, isLoading, error, refetch } = useAdminCustomerList(filters);
  const updateStatusMutation = useUpdateCustomerStatus();

  const customers = customerData?.data || [];
  const totalItems = customerData?.total || 0;
  const totalPages = customerData?.totalPages || 0;
  const stats = customerData?.stats || { total: 0, active: 0, suspended: 0 };

  const handleToggleStatus = async (customerId: string, currentStatus: string, customerName: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';

    const confirmed = await blockConfirmation.confirm({
      type: newStatus === 'suspended' ? 'block' : 'warning',
      title: newStatus === 'suspended' ? 'Block Customer?' : 'Unblock Customer?',
      description: newStatus === 'suspended'
        ? 'This customer will be blocked and unable to place orders or book services until unblocked.'
        : 'This customer will be unblocked and able to use the platform again.',
      confirmText: newStatus === 'suspended' ? 'Yes, Block' : 'Yes, Unblock',
      cancelText: 'Cancel',
      itemName: customerName,
    });

    if (confirmed) {
      await updateStatusMutation.mutateAsync({ customerId, status: newStatus });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <Loading text="Loading customers..." />;
  }

  if (error) {
    return (
      <Error
        message="Failed to load customers"
        details={(error as Error)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your customer accounts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.total}
          description="All registered customers"
        />

        <StatCard
          icon={CheckCircle}
          label="Active"
          value={stats.active}
          valueClassName="text-green-600"
          description="Active accounts"
        />

        <StatCard
          icon={Ban}
          label="Blocked"
          value={stats.suspended}
          valueClassName="text-destructive"
          description="Blocked accounts"
          className="xs:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Customer Table */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Customers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
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
                  { label: 'Blocked', value: 'suspended' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Table */}
          {customers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              description={search ? "Try adjusting your search or filters" : "Customers will appear here once they register"}
            />
          ) : (
            <div className="rounded-lg border-2 border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[160px]">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[130px]">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell w-[180px]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell w-[80px]">
                        Orders
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell w-[100px]">
                        Spent
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                        {/* Customer Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {customer.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <p className="font-semibold text-sm text-foreground truncate">{customer.name}</p>
                          </div>
                        </td>
                        {/* Phone */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-foreground">{customer.phone || '-'}</p>
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <p className="text-sm text-foreground truncate max-w-[160px]">
                            {customer.email || <span className="text-muted-foreground">-</span>}
                          </p>
                        </td>
                        {/* Orders */}
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <span className="text-sm font-medium text-foreground">
                            {customer.totalOrders + customer.totalBookings}
                          </span>
                        </td>
                        {/* Spent */}
                        <td className="px-4 py-3 text-center hidden lg:table-cell">
                          <span className="text-sm font-semibold text-primary">
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <Badge variant={customer.status === 'active' ? 'success' : 'error'}>
                            {customer.status === 'active' ? 'Active' : 'Blocked'}
                          </Badge>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(AdminRoutes.CUSTOMER_DETAIL(customer.id))}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${customer.status === 'suspended'
                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
                                : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20'
                                }`}
                              onClick={() => handleToggleStatus(customer.id, customer.status, customer.name)}
                              disabled={updateStatusMutation.isPending}
                            >
                              {customer.status === 'suspended' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {customers.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              className="mt-4 sm:mt-6"
            />
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <blockConfirmation.ConfirmDialog />
    </div>
  );
}
