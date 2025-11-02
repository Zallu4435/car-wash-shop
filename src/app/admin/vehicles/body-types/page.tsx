'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Bike, Plus, Edit, Trash2, Move, Layers, ArrowLeft } from 'lucide-react';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';

// Body types data
const bodyTypes = [
  // 4-Wheeler body types
  { id: 'sedan', name: 'Sedan', vehicleType: '4-Wheeler', icon: 'Car', order: 1, active: true, modelsCount: 12 },
  { id: 'suv', name: 'SUV', vehicleType: '4-Wheeler', icon: 'Car', order: 2, active: true, modelsCount: 10 },
  { id: 'hatchback', name: 'Hatchback', vehicleType: '4-Wheeler', icon: 'Car', order: 3, active: true, modelsCount: 8 },
  { id: 'luxury', name: 'Luxury', vehicleType: '4-Wheeler', icon: 'Car', order: 4, active: true, modelsCount: 5 },
  { id: 'compact-suv', name: 'Compact SUV', vehicleType: '4-Wheeler', icon: 'Car', order: 5, active: false, modelsCount: 0 },
  
  // 2-Wheeler body types
  { id: 'bike', name: 'Bike', vehicleType: '2-Wheeler', icon: 'Bike', order: 1, active: true, modelsCount: 6 },
  { id: 'scooty', name: 'Scooty', vehicleType: '2-Wheeler', icon: 'Bike', order: 2, active: true, modelsCount: 4 },
];

const iconMap = { Car, Bike };

export default function BodyTypesPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDelete = async (bodyTypeId: string, bodyTypeName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Body Type?',
      description: 'This will permanently delete this body type. Vehicle models using this body type will need to be reassigned. This action cannot be undone.',
      confirmText: 'Yes, Delete Body Type',
      cancelText: 'Cancel',
      itemName: bodyTypeName,
    });

    if (confirmed) {
      // TODO: Implement delete body type API
      toast.success(`Body type "${bodyTypeName}" has been deleted`);
    }
  };

  // Apply filters
  const filteredTypes = useMemo(() => {
    return bodyTypes.filter(t => {
      const matchesSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = !filterValues.vehicleType || t.vehicleType === filterValues.vehicleType;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterValues]);

  // Pagination
  const totalItems = filteredTypes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTypes = filteredTypes.slice(startIndex, endIndex);

  const fourWheelerCount = bodyTypes.filter((t: any) => t.vehicleType === '4-Wheeler').length;
  const twoWheelerCount = bodyTypes.filter((t: any) => t.vehicleType === '2-Wheeler').length;
  const activeCount = bodyTypes.filter((t: any) => t.active).length;

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
              Body Types
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
              Manage vehicle body types and categories
            </p>
          </div>
          <Button onClick={() => router.push(AdminRoutes.VEHICLE_BODY_TYPE_NEW)} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add Body Type
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Layers, label: 'Total Body Types', value: bodyTypes.length },
          { icon: Car, label: '4-Wheeler Types', value: fourWheelerCount },
          { icon: Bike, label: '2-Wheeler Types', value: twoWheelerCount },
          { icon: Layers, label: 'Active Types', value: activeCount },
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

      {/* Body Types List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Body Types</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <SearchFilter
            searchPlaceholder="Search body types..."
            onSearchChange={setSearch}
            filterOptions={[
              {
                label: 'Vehicle Type',
                value: 'vehicleType',
                options: [
                  { label: 'All Types', value: '' },
                  { label: '4-Wheeler', value: '4-Wheeler' },
                  { label: '2-Wheeler', value: '2-Wheeler' },
                ],
              },
            ]}
            onFilterChange={setFilterValues}
            className="mb-4 sm:mb-6"
          />

          {/* Body Types Grid */}
          {paginatedTypes.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No body types found"
              description={search ? "Try adjusting your search or filters" : "No body types available"}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {paginatedTypes.map((type) => {
              const Icon = iconMap[type.icon as keyof typeof iconMap];
              return (
                <TransactionCard
                  key={type.id}
                  id={type.id}
                  icon={Icon}
                  layout="horizontal"
                  primaryBadge={{
                    label: type.vehicleType,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: type.active ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={type.name}
                  subtitle={`${type.modelsCount} models available`}
                  amount={`Order: ${type.order}`}
                  amountLabel="Position"
                  additionalContent={
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Move className="h-4 w-4" />
                      <span className="text-sm font-mono">{type.order}</span>
                    </div>
                  }
                  actionButtons={[
                    {
                      label: 'Edit',
                      icon: Edit,
                      onClick: () => router.push(AdminRoutes.VEHICLE_BODY_TYPE_EDIT(type.id)),
                      hideTextOnMobile: true,
                    },
                    {
                      label: '',
                      icon: Trash2,
                      onClick: () => handleDelete(type.id, type.name),
                      className: 'text-destructive hover:bg-destructive/10 flex-initial px-3',
                    },
                  ]}
                />
              );
              })}
            </div>
          )}
          
          {/* Pagination */}
          {paginatedTypes.length > 0 && (
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

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              4-Wheeler Body Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {bodyTypes.filter(t => t.vehicleType === '4-Wheeler').map((type) => (
                <div key={type.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground truncate">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{type.modelsCount} models</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                      {type.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(AdminRoutes.VEHICLE_BODY_TYPE_EDIT(type.id))}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(type.id, type.name)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Bike className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              2-Wheeler Body Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {bodyTypes.filter(t => t.vehicleType === '2-Wheeler').map((type) => (
                <div key={type.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground truncate">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{type.modelsCount} models</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                      {type.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(AdminRoutes.VEHICLE_BODY_TYPE_EDIT(type.id))}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(type.id, type.name)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
