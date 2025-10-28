'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Car, Bike, Plus, Search, Edit, Trash2, Move } from 'lucide-react';

// Updated vehicle types structure
const vehicleTypes = [
  { id: '4-wheeler', name: '4-Wheeler', icon: 'Car', order: 1, active: true, bodyTypesCount: 5, modelsCount: 35 },
  { id: '2-wheeler', name: '2-Wheeler', icon: 'Bike', order: 2, active: true, bodyTypesCount: 2, modelsCount: 10 },
];

const iconMap = { Car, Bike };

export default function VehicleTypesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = vehicleTypes.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Vehicle Types
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage available vehicle categories (4-Wheeler, 2-Wheeler)
          </p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/types/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Vehicle Type
        </Button>
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
                <Card key={type.id} className="border-2 border-border hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-5">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-muted-foreground cursor-move">
                          <Move className="h-4 w-4" />
                          <span className="text-sm font-mono">{type.order}</span>
                        </div>
                        
                        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                            {type.name}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {type.bodyTypesCount} body types
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {type.modelsCount} models
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                          {type.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vehicles/types/${type.id}/edit`)}
                          className="h-9 text-xs sm:text-sm"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Move className="h-3.5 w-3.5" />
                          <span className="text-xs font-mono">{type.order}</span>
                        </div>
                        
                        <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm text-foreground truncate">
                            {type.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {type.bodyTypesCount} body types
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {type.modelsCount} models
                            </Badge>
                            <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                              {type.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vehicles/types/${type.id}/edit`)}
                          className="flex-1 h-9 text-xs"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
