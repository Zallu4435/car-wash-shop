'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  ArrowRight,
  Star,
  Layers
} from 'lucide-react';

export default function VehiclesHomePage() {
  const router = useRouter();

  const vehicleSections = [
    {
      title: 'Vehicle Types',
      description: 'Manage vehicle categories (Car, Bike, Truck)',
      icon: Layers,
      count: 3,
      href: '/admin/vehicles/types',
    },
    {
      title: 'Brands',
      description: 'Manage brands by vehicle type',
      icon: Car,
      count: 8,
      href: '/admin/vehicles/brands',
    },
    {
      title: 'Models',
      description: 'Manage vehicle models and variants',
      icon: Car,
      count: 60,
      href: '/admin/vehicles/models',
    },
  ];

  const stats = [
    {
      title: 'Total Types',
      value: '3',
      icon: Layers,
    },
    {
      title: 'Total Brands',
      value: '8',
      icon: Car,
    },
    {
      title: 'Total Models',
      value: '60',
      icon: Car,
    },
    {
      title: 'Popular Brands',
      value: '5',
      icon: Star,
    },
  ];

  const popularBrands = [
    { name: 'Toyota', models: 12, type: 'Car' },
    { name: 'Honda', models: 8, type: 'Car' },
    { name: 'Hero', models: 8, type: 'Bike' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Vehicle Management</h1>
        <p className="text-muted-foreground mt-1">Manage vehicle types, brands, and models</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicleSections.map((section) => (
          <Card 
            key={section.title} 
            className="border-2 border-border hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => router.push(section.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{section.count}</p>
                  <p className="text-xs text-muted-foreground">Total items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Brands */}
      <Card className="border-2 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Popular Brands</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/vehicles/brands')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularBrands.map((brand, index) => (
              <div key={brand.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">{brand.models} models · {brand.type}</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
