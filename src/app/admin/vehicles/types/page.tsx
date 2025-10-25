'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Car, Bike, Truck, Plus, Search, Edit, Trash2, Move } from 'lucide-react';

// This would come from your database
const vehicleTypes = [
  { id: 'car', name: 'Car', icon: 'Car', order: 1, active: true, brandsCount: 5, modelsCount: 52 },
  { id: 'bike', name: 'Bike', icon: 'Bike', order: 2, active: true, brandsCount: 3, modelsCount: 25 },
  { id: 'truck', name: 'Truck', icon: 'Truck', order: 3, active: false, brandsCount: 2, modelsCount: 10 },
];

const iconMap = { Car, Bike, Truck };

export default function VehicleTypesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = vehicleTypes.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Vehicle Types</h1>
          <p className="text-muted-foreground mt-1">Manage available vehicle categories</p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/types/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle Type
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Types</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{vehicleTypes.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Active Types</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {vehicleTypes.filter(t => t.active).length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Brands</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {vehicleTypes.reduce((sum, t) => sum + t.brandsCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Types List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Vehicle Types</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicle types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3">
            {filteredTypes.map((type) => {
              const Icon = iconMap[type.icon as keyof typeof iconMap];
              return (
                <Card key={type.id} className="border-2 border-border hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground cursor-move">
                          <Move className="h-4 w-4" />
                          <span className="text-sm font-mono">{type.order}</span>
                        </div>
                        
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-foreground">{type.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {type.brandsCount} brands
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {type.modelsCount} models
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={type.active ? 'default' : 'secondary'}>
                          {type.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vehicles/types/${type.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
