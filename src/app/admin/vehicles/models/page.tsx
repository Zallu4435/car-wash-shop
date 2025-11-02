'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Bike, Plus, Edit, Trash2, Eye, Layers, ArrowLeft } from 'lucide-react';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import { useVehicleModels } from '@/api/domains/admin-vehicles/queries';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';

const iconMap = { Car, Bike };

export default function VehicleModelsPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDelete = async (modelId: string, modelName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Vehicle Model?',
      description: 'This will permanently delete this vehicle model. Customer vehicles using this model will need to be updated. This action cannot be undone.',
      confirmText: 'Yes, Delete Model',
      cancelText: 'Cancel',
      itemName: modelName,
    });

    if (confirmed) {
      // TODO: Implement delete model API
      toast.success(`Vehicle model "${modelName}" has been deleted`);
    }
  };

  const { data: modelsData, isLoading, error, refetch } = useVehicleModels();
  const vehicles = modelsData || [];

  if (isLoading) {
    return <Loading text="Loading vehicle models..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load vehicle models" 
        details={(error as any)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  // Apply filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: any) => {
      const matchesSearch = search === '' || v.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = !filterValues.type || v.type === filterValues.type;
      const matchesStatus = !filterValues.status || v.status === filterValues.status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, search, filterValues]);

  // Pagination
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  const activeCount = vehicles.filter((v: any) => v.status === 'active').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push(AdminRoutes.VEHICLES)} 
          className="w-fit h-9 sm:h-10 text-xs sm:text-sm -ml-2"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Vehicles
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
              Vehicle Models
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
              Manage specific vehicle models and variants
            </p>
          </div>
          <Button onClick={() => router.push(AdminRoutes.VEHICLE_MODEL_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Car, label: 'Total Models', value: vehicles.length },
          { icon: Car, label: 'Sedan', value: vehicles.filter((v: any) => v.type === 'sedan').length },
          { icon: Car, label: 'Hatchback', value: vehicles.filter((v: any) => v.type === 'hatchback').length },
          { icon: Layers, label: 'Active', value: activeCount },
        ].map((stat, index) => (
          <Card key={index} className="border-2 border-border">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate flex-1">{stat.label}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicles List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Vehicles</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search vehicles by name..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Type',
                value: 'type',
                options: [
                  { label: 'All Types', value: '' },
                  { label: 'Sedan', value: 'sedan' },
                  { label: 'Hatchback', value: 'hatchback' },
                  { label: 'SUV', value: 'suv' },
                ],
              },
              {
                label: 'Status',
                value: 'status',
                options: [
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Vehicles Grid */}
          {paginatedVehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No vehicles found"
              description={search ? "Try adjusting your search or filters" : "No vehicle models available"}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {paginatedVehicles.map((vehicle: any) => (
                <TransactionCard
                  key={vehicle.id}
                  id={vehicle.id}
                  icon={Car}
                  layout="vertical"
                  primaryBadge={{
                    label: vehicle.type,
                    variant: 'outline',
                    className: 'capitalize',
                  }}
                  statusBadge={{
                    label: vehicle.status === 'active' ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={vehicle.name}
                  subtitle={vehicle.brandName}
                  infoBoxes={[
                    {
                      icon: Car,
                      label: 'Brand',
                      value: vehicle.brandName,
                    },
                  ]}
                  actionButtons={[
                    {
                      label: 'View',
                      icon: Eye,
                      onClick: () => router.push(AdminRoutes.VEHICLE_MODEL_DETAILS(vehicle.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.VEHICLE_MODEL_EDIT(vehicle.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(vehicle.id, vehicle.brandName + ' ' + vehicle.name),
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {paginatedVehicles.length > 0 && (
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
