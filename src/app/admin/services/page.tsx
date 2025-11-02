'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Clock,
  IndianRupee,
  TrendingUp
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminServiceList, useDeleteService } from '@/api/domains/admin-catalog/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatCard } from '@/components/admin/StatCard';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';

export default function ServicesPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Combine search and filters for API
  const filters = useMemo(() => ({
    search: search || undefined,
    status: filterValues.status || undefined,
    category: filterValues.category || undefined,
    page,
    pageSize,
  }), [search, filterValues, page, pageSize]);

  const { data: servicesResponse, isLoading, error, refetch } = useAdminServiceList(filters);
  const deleteServiceMutation = useDeleteService();

  const services = servicesResponse?.data || [];
  const totalItems = servicesResponse?.total || 0;
  const totalPages = servicesResponse?.totalPages || 0;
  const filteredServices = services; // Already filtered by API

  const activeServices = services.filter(s => s.status === 'active').length;
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
  const avgPrice = services.length > 0 ? totalRevenue / services.length : 0;

  const handleDelete = async (serviceId: string, serviceName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Service?',
      description: 'This will permanently delete this service. Customers will no longer be able to book this service. This action cannot be undone.',
      confirmText: 'Yes, Delete Service',
      cancelText: 'Cancel',
      itemName: serviceName,
    });

    if (confirmed) {
      await deleteServiceMutation.mutateAsync(serviceId);
      toast.success(`Service "${serviceName}" has been deleted`);
    }
  };

  if (isLoading) {
    return <Loading text="Loading services..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load services" 
        details={(error as any)?.message}
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
            Services
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage your service offerings
          </p>
        </div>
        <Button onClick={() => router.push(AdminRoutes.SERVICE_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={Car}
          label="Total Services"
          value={services.length}
          change="+6.5%"
          trend="up"
          description="All services"
        />
        
        <StatCard
          icon={TrendingUp}
          label="Active Services"
          value={activeServices}
          change="+10.2%"
          trend="up"
          description="Currently active"
        />
        
        <StatCard
          icon={IndianRupee}
          label="Avg. Price"
          value={`₹${avgPrice.toFixed(0)}`}
          valueClassName="text-primary"
          change="+4.8%"
          trend="up"
          description="Average pricing"
          className="xs:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Services List */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <CardTitle className="text-sm sm:text-base lg:text-lg">All Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder="Search services by name or category..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
              {
                label: 'Category',
                value: 'category',
                options: [
                  { label: 'All Categories', value: '' },
                  { label: 'Exterior Wash', value: 'exterior-wash' },
                  { label: 'Interior Cleaning', value: 'interior-cleaning' },
                  { label: 'Detailing', value: 'detailing' },
                  { label: 'Polish & Wax', value: 'polish-wax' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No services found"
              description={search ? "Try adjusting your search or filters" : "No services available"}
              action={
                !search && (
                  <Button onClick={() => router.push(AdminRoutes.SERVICE_NEW)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredServices.map((service) => (
                <TransactionCard
                  key={service.id}
                  id={service.id}
                  icon={Car}
                  layout="vertical"
                  primaryBadge={{
                    label: service.category,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: service.status === 'active' ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={service.name}
                  subtitle={service.category}
                  description={service.description || 'No description available'}
                  infoBoxes={[
                    {
                      icon: IndianRupee,
                      label: 'Price',
                      value: `₹${service.price}`,
                      valueClassName: 'text-primary',
                    },
                    {
                      icon: Clock,
                      label: 'Duration',
                      value: `${service.duration} min`,
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'View',
                      icon: Eye,
                      onClick: () => router.push(`${AdminRoutes.SERVICES}/${service.id}`), // TODO: Add SERVICE_DETAIL constant
                      hideTextOnMobile: true,
                    },
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.SERVICE_EDIT(service.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(service.id, service.name),
                      disabled: deleteServiceMutation.isPending,
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredServices.length > 0 && (
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
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
