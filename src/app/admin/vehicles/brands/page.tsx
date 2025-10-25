'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Search, Eye, Edit, Trash2, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';

const brands = [
  { id: 'brand_001', name: 'Toyota', vehicleTypeId: 'car', vehicleTypeName: 'Car', popular: true, modelsCount: 12, active: true },
  { id: 'brand_002', name: 'Honda', vehicleTypeId: 'car', vehicleTypeName: 'Car', popular: true, modelsCount: 8, active: true },
  { id: 'brand_003', name: 'Maruti Suzuki', vehicleTypeId: 'car', vehicleTypeName: 'Car', popular: true, modelsCount: 15, active: true },
  { id: 'brand_004', name: 'Hyundai', vehicleTypeId: 'car', vehicleTypeName: 'Car', popular: false, modelsCount: 10, active: true },
  { id: 'brand_005', name: 'Tata', vehicleTypeId: 'car', vehicleTypeName: 'Car', popular: false, modelsCount: 7, active: true },
  { id: 'brand_006', name: 'Hero', vehicleTypeId: 'bike', vehicleTypeName: 'Bike', popular: true, modelsCount: 8, active: true },
  { id: 'brand_007', name: 'Honda (Bike)', vehicleTypeId: 'bike', vehicleTypeName: 'Bike', popular: true, modelsCount: 6, active: true },
  { id: 'brand_008', name: 'Royal Enfield', vehicleTypeId: 'bike', vehicleTypeName: 'Bike', popular: false, modelsCount: 11, active: true },
];

export default function BrandsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');

  const filteredBrands = brands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = vehicleTypeFilter === 'all' || b.vehicleTypeId === vehicleTypeFilter;
    return matchesSearch && matchesType;
  });

  const vehicleTypes = Array.from(new Set(brands.map(b => ({ id: b.vehicleTypeId, name: b.vehicleTypeName }))));
  const popularBrands = brands.filter(b => b.popular).length;
  const totalModels = brands.reduce((sum, b) => sum + b.modelsCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Vehicle Brands</h1>
          <p className="text-muted-foreground mt-1">Manage brands and manufacturers</p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/brands/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
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
              <p className="text-sm text-muted-foreground">Total Brands</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{brands.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Popular Brands</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{popularBrands}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Models</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalModels}</p>
          </CardContent>
        </Card>
      </div>

      {/* Brands List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Brands</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vehicleTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((brand) => (
              <Card key={brand.id} className="border-2 border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{brand.name}</h3>
                        <Badge variant="outline" className="mt-1 text-xs">{brand.vehicleTypeName}</Badge>
                      </div>
                    </div>
                    <Badge variant={brand.active ? 'default' : 'secondary'}>
                      {brand.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {brand.popular && (
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}

                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Models</p>
                    <p className="text-2xl font-bold text-foreground">{brand.modelsCount}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/vehicles/brands/${brand.id}/edit`)}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
