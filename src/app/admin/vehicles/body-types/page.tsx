'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Bike, Plus, Search, Edit, Trash2, Move, Layers } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');

  const filteredTypes = bodyTypes.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = vehicleTypeFilter === 'all' || t.vehicleType === vehicleTypeFilter;
    return matchesSearch && matchesFilter;
  });

  const fourWheelerCount = bodyTypes.filter(t => t.vehicleType === '4-Wheeler').length;
  const twoWheelerCount = bodyTypes.filter(t => t.vehicleType === '2-Wheeler').length;
  const activeCount = bodyTypes.filter(t => t.active).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Body Types
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage vehicle body types and categories
          </p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/body-types/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Body Type
        </Button>
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
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search body types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 h-10 sm:h-11 text-xs sm:text-sm"
              />
            </div>
            
            <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Body Types Grid */}
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
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                              {type.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {type.vehicleType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {type.modelsCount} models available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                          {type.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vehicles/body-types/${type.id}/edit`)}
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
                              {type.vehicleType}
                            </Badge>
                            <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs">
                              {type.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            {type.modelsCount} models available
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/vehicles/body-types/${type.id}/edit`)}
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

          {/* No Results */}
          {filteredTypes.length === 0 && (
            <div className="text-center py-10 sm:py-12 bg-muted/30 rounded-lg sm:rounded-xl border-2 border-dashed border-border">
              <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                No body types found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
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
                <div key={type.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground truncate">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{type.modelsCount} models</p>
                  </div>
                  <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                    {type.active ? 'Active' : 'Inactive'}
                  </Badge>
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
                <div key={type.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm sm:text-base text-foreground truncate">{type.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{type.modelsCount} models</p>
                  </div>
                  <Badge variant={type.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                    {type.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
