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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
          className="sm:col-span-2 md:col-span-1"
        />
      </div>

      {/* Customer List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Customers</CardTitle>
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
              <Card key={customer.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {customer.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          Joined {customer.joinedDate}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => router.push(AdminRoutes.CUSTOMER_DETAIL(customer.id))}
                      className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{customer.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Orders</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">{customer.totalOrders}</p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Spent</p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        ₹{customer.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
