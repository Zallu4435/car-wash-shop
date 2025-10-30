'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Plus, 
  Search, 
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
import { Pagination } from '@/components/admin/Pagination';

export default function ServicesPage() {
  const router = useRouter();
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

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteServiceMutation.mutateAsync(serviceId);
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
        <Button onClick={() => router.push('/admin/services/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-2">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Services</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{services.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Services</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{activeServices}</p>
          </CardContent>
        </Card>

        <Card className="border-2 sm:col-span-2 md:col-span-1">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-950/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg. Price</p>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">₹{Math.round(totalRevenue / services.length)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Services</CardTitle>
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
                  <Button onClick={() => router.push('/admin/services/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredServices.map((service) => (
              <Card key={service.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                        <Car className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                          {service.name}
                        </h3>
                        <Badge variant="outline" className="text-xs mt-0.5 sm:mt-1">
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {service.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                    {service.description || 'No description available'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Price</p>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-primary">₹{service.price}</p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Duration</p>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-foreground">{service.duration} min</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/services/${service.id}`)}
                    >
                      <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                    >
                      <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteServiceMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
}
