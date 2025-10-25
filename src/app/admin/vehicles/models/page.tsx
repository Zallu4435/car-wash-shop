'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const models = [
  { id: 'model_001', brandId: 'brand_001', brandName: 'Toyota', name: 'Camry', vehicleType: 'Car', active: true },
  { id: 'model_002', brandId: 'brand_001', brandName: 'Toyota', name: 'Fortuner', vehicleType: 'Car', active: true },
  { id: 'model_003', brandId: 'brand_002', brandName: 'Honda', name: 'City', vehicleType: 'Car', active: true },
  { id: 'model_004', brandId: 'brand_002', brandName: 'Honda', name: 'Civic', vehicleType: 'Car', active: true },
  { id: 'model_005', brandId: 'brand_003', brandName: 'Maruti Suzuki', name: 'Swift', vehicleType: 'Car', active: true },
  { id: 'model_006', brandId: 'brand_006', brandName: 'Hero', name: 'Splendor', vehicleType: 'Bike', active: true },
];

export default function ModelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const filteredModels = models.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === 'all' || m.brandName === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const brands = Array.from(new Set(models.map(m => m.brandName)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Vehicle Models</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle models</p>
        </div>
        <Button onClick={() => router.push('/admin/vehicles/models/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Model
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
              <p className="text-sm text-muted-foreground">Total Models</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{models.length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Active Models</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{models.filter(m => m.active).length}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Brands</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{brands.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>All Models</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Models Grid */}
          <div className="space-y-3">
            {filteredModels.map((model) => (
              <Card key={model.id} className="border-2 border-border hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{model.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{model.brandName}</Badge>
                          <Badge variant="outline" className="text-xs">{model.vehicleType}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={model.active ? 'default' : 'secondary'}>
                        {model.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/vehicles/models/${model.id}/edit`)}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
