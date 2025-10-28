'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Bike, Plus, Search, Edit, Trash2, Eye, Layers } from 'lucide-react';

// Vehicle models data
const vehicles = [
  // 4-Wheeler Sedans
  { id: 'swift-dzire', name: 'Swift Dzire', bodyType: 'Sedan', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 245 },
  { id: 'honda-city', name: 'Honda City', bodyType: 'Sedan', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 198 },
  { id: 'hyundai-verna', name: 'Hyundai Verna', bodyType: 'Sedan', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 156 },
  
  // 4-Wheeler SUVs
  { id: 'tata-nexon', name: 'Tata Nexon', bodyType: 'SUV', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 289 },
  { id: 'hyundai-creta', name: 'Hyundai Creta', bodyType: 'SUV', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 267 },
  { id: 'mahindra-xuv500', name: 'Mahindra XUV500', bodyType: 'SUV', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 145 },
  
  // 4-Wheeler Hatchbacks
  { id: 'maruti-alto', name: 'Maruti Alto', bodyType: 'Hatchback', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 178 },
  { id: 'hyundai-i20', name: 'Hyundai i20', bodyType: 'Hatchback', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 156 },
  { id: 'maruti-swift', name: 'Maruti Swift', bodyType: 'Hatchback', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 234 },
  
  // 4-Wheeler Luxury
  { id: 'bmw-3-series', name: 'BMW 3 Series', bodyType: 'Luxury', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 67 },
  { id: 'audi-a4', name: 'Audi A4', bodyType: 'Luxury', vehicleType: '4-Wheeler', icon: 'Car', active: true, bookings: 45 },
  
  // 2-Wheeler Bikes
  { id: 'royal-enfield-classic', name: 'Royal Enfield Classic 350', bodyType: 'Bike', vehicleType: '2-Wheeler', icon: 'Bike', active: true, bookings: 134 },
  { id: 'bajaj-pulsar', name: 'Bajaj Pulsar 150', bodyType: 'Bike', vehicleType: '2-Wheeler', icon: 'Bike', active: true, bookings: 112 },
  { id: 'hero-splendor', name: 'Hero Splendor Plus', bodyType: 'Bike', vehicleType: '2-Wheeler', icon: 'Bike', active: true, bookings: 98 },
  
  // 2-Wheeler Scooties
  { id: 'honda-activa', name: 'Honda Activa', bodyType: 'Scooty', vehicleType: '2-Wheeler', icon: 'Bike', active: true, bookings: 189 },
  { id: 'tvs-jupiter', name: 'TVS Jupiter', bodyType: 'Scooty', vehicleType: '2-Wheeler', icon: 'Bike', active: true, bookings: 145 },
  { id: 'suzuki-access', name: 'Suzuki Access 125', bodyType: 'Scooty', vehicleType: '2-Wheeler', icon: 'Bike', active: false, bookings: 0 },
];

const iconMap = { Car, Bike };

export default function VehicleModelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicleType = vehicleTypeFilter === 'all' || v.vehicleType === vehicleTypeFilter;
    const matchesBodyType = bodyTypeFilter === 'all' || v.bodyType === bodyTypeFilter;
    return matchesSearch && matchesVehicleType && matchesBodyType;
  });

  const fourWheelerCount = vehicles.filter(v => v.vehicleType === '4-Wheeler').length;
  const twoWheelerCount = vehicles.filter(v => v.vehicleType === '2-Wheeler').length;
  const activeCount = vehicles.filter(v => v.active).length;

  // Get body types based on selected vehicle type
  const getBodyTypes = () => {
    if (vehicleTypeFilter === '4-Wheeler') {
      return ['Sedan', 'SUV', 'Hatchback', 'Luxury'];
    } else if (vehicleTypeFilter === '2-Wheeler') {
      return ['Bike', 'Scooty'];
    }
    return ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Bike', 'Scooty'];
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
            Vehicle Models
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
            Manage specific vehicle models and variants
          </p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/models/new')} className="w-full md:w-auto h-9 sm:h-10 text-xs sm:text-sm">
          <Plus className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Car, label: 'Total Vehicles', value: vehicles.length },
          { icon: Car, label: '4-Wheeler', value: fourWheelerCount },
          { icon: Bike, label: '2-Wheeler', value: twoWheelerCount },
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
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
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

            <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}>
              <SelectTrigger className="w-full md:w-48 h-10 sm:h-11 text-xs sm:text-sm">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Types</SelectItem>
                {getBodyTypes().map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filteredVehicles.map((vehicle) => {
              const Icon = iconMap[vehicle.icon as keyof typeof iconMap];
              return (
                <Card key={vehicle.id} className="border-2 border-border hover:shadow-lg transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl flex-shrink-0">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                            {vehicle.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {vehicle.bodyType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.vehicleType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant={vehicle.active ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                        {vehicle.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg mb-3 sm:mb-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Total Bookings</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{vehicle.bookings}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs sm:text-sm"
                        onClick={() => router.push(`/admin/vehicles/models/${vehicle.id}`)}
                      >
                        <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs sm:text-sm"
                        onClick={() => router.push(`/admin/vehicles/models/${vehicle.id}/edit`)}
                      >
                        <Edit className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-10 sm:py-12 bg-muted/30 rounded-lg sm:rounded-xl border-2 border-dashed border-border">
              <Car className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                No vehicles found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setVehicleTypeFilter('all');
                setBodyTypeFilter('all');
              }} className="h-9 sm:h-10 text-xs sm:text-sm">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
