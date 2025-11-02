'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TransactionCard } from '@/components/admin/TransactionCard';
import { Car, Bike, Plus, Search, Edit, Trash2, Move, ArrowLeft } from 'lucide-react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { toast } from 'sonner';

// Updated vehicle types structure
const vehicleTypes = [
  { id: '4-wheeler', name: '4-Wheeler', icon: 'Car', order: 1, active: true, bodyTypesCount: 5, modelsCount: 35 },
  { id: '2-wheeler', name: '2-Wheeler', icon: 'Bike', order: 2, active: true, bodyTypesCount: 2, modelsCount: 10 },
];

const iconMap = { Car, Bike };

export default function VehicleTypesPage() {
  const router = useRouter();
  const deleteConfirmation = useConfirmation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (typeId: string, typeName: string) => {
    const confirmed = await deleteConfirmation.confirm({
      type: 'delete',
      title: 'Delete Vehicle Type?',
      description: 'This will permanently delete this vehicle type. All associated body types and models will need to be reassigned. This action cannot be undone.',
      confirmText: 'Yes, Delete Type',
      cancelText: 'Cancel',
      itemName: typeName,
    });

    if (confirmed) {
      // TODO: Implement delete vehicle type API
      toast.success(`Vehicle type "${typeName}" has been deleted`);
    }
  };

  const filteredTypes = vehicleTypes.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/admin/vehicles')} 
          className="w-fit h-9 sm:h-10 text-xs sm:text-sm -ml-2"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Vehicles
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
              Vehicle Types
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
              Manage available vehicle categories (4-Wheeler, 2-Wheeler)
            </p>
          </div>
          <Button onClick={() => router.push('/admin/vehicles/types/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2">
            <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add Vehicle Type
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: Car, label: 'Total Types', value: vehicleTypes.length },
          { icon: Car, label: 'Active Types', value: vehicleTypes.filter(t => t.active).length },
          { icon: Car, label: 'Total Body Types', value: vehicleTypes.reduce((sum, t) => sum + t.bodyTypesCount, 0) },
        ].map((stat, index) => (
          <Card key={index} className={`border-2 border-border ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle Types List */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-lg">All Vehicle Types</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicle types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {filteredTypes.map((type) => {
              const Icon = iconMap[type.icon as keyof typeof iconMap];
              return (
                <TransactionCard
                  key={type.id}
                  id={type.id}
                  icon={Icon}
                  layout="horizontal"
                  primaryBadge={{
                    label: `${type.bodyTypesCount} body types`,
                    variant: 'outline',
                  }}
                  statusBadge={{
                    label: type.active ? 'Active' : 'Inactive',
                    className: '',
                  }}
                  title={type.name}
                  subtitle={`${type.modelsCount} models`}
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
                      onClick: () => router.push(`/admin/vehicles/types/${type.id}/edit`),
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
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <deleteConfirmation.ConfirmDialog />
    </div>
  );
}
